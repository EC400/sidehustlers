"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "@/src/app/dashboard/dashboard.css";
import Header from "@/src/components/ui/header";
import Footer from "@/src/components/ui/footer";
import { useAuth } from "@/src/hooks/useAuth";
import { serviceQueries, FirestoreService } from "@/src/lib/db";
import { useRouter } from "next/navigation";

interface UserStats {
  activeServices: number;
  totalOrders: number;
  averageRating: number;
  serviceAreas: number;
}

const MyServicesPage = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    activeServices: 0,
    totalOrders: 0,
    averageRating: 0,
    serviceAreas: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const categories = [
    "Fahrzeug & Transport",
    "Transport & Logistik",
    "Garten & Außenbereich",
    "Handwerk & Reparaturen",
    "Haushalt & Reinigung",
    "Elektronik & IT",
    "Betreuung & Pflege",
  ];

  // Redirect if not logged in or not a seller
  useEffect(() => {
    if (!loading && (!user || user.role !== "seller")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Load services data
  useEffect(() => {
    if (user && user.role === "seller") {
      loadServicesData();
    }
  }, [user]);

  const loadServicesData = async () => {
    if (!user) return;

    try {
      setDataLoading(true);
      setError("");

      // Load services for the seller
      const userServices = await serviceQueries.getServicesBySeller(user.id);
      console.log("Loaded services:", userServices);

      // Map services to include id and isActive
      const servicesData = userServices.map((service) => ({
        ...service,
        id: service.id || `service_${Date.now()}`,
        isActive: service.status === "active",
      }));

      setServices(servicesData);

      // Calculate stats
      const activeServices = servicesData.filter((s) => s.isActive);
      const totalOrders = servicesData.reduce(
        (sum, s) => sum + (s.reviewCount || 0),
        0
      );
      const averageRating =
        servicesData.length > 0
          ? servicesData.reduce((sum, s) => sum + (s.rating || 0), 0) /
            servicesData.length
          : 0;

      // Count unique service areas (would need location data from services)
      const serviceAreas = new Set(servicesData.map((s) => "default")).size; // Placeholder

      setUserStats({
        activeServices: activeServices.length,
        totalOrders,
        averageRating,
        serviceAreas,
      });
    } catch (error) {
      console.error("Error loading services data:", error);
      setError("Fehler beim Laden der Services");
    } finally {
      setDataLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleServiceStatus = async (serviceId: string) => {
    try {
      const service = services.find((s) => s.id === serviceId);
      if (!service) return;

      const newStatus = service.isActive ? "inactive" : "active";
      await FirestoreService.updateDocument("services", serviceId, {
        status: newStatus,
      });

      // Update local state
      setServices(
        services.map((s) =>
          s.id === serviceId
            ? { ...s, isActive: !s.isActive, status: newStatus }
            : s
        )
      );

      // Refresh stats
      await loadServicesData();
    } catch (error) {
      console.error("Error updating service status:", error);
      setError("Fehler beim Aktualisieren des Service-Status");
    }
  };

  const deleteService = async (serviceId: string) => {
    if (
      !window.confirm(
        "Sind Sie sicher, dass Sie diesen Service löschen möchten?"
      )
    ) {
      return;
    }

    try {
      await FirestoreService.deleteDocument("services", serviceId);
      setServices(services.filter((s) => s.id !== serviceId));
      await loadServicesData(); // Refresh stats
    } catch (error) {
      console.error("Error deleting service:", error);
      setError("Fehler beim Löschen des Services");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatPriceRange = (
    minBudget: number,
    maxBudget: number,
    pricingType?: string
  ) => {
    const suffix =
      pricingType === "perHour"
        ? "/Std."
        : pricingType === "perPiece"
        ? "/Stück"
        : pricingType === "fixed"
        ? ""
        : "";

    if (minBudget === maxBudget) {
      return `€${minBudget}${suffix}`;
    }
    return `€${minBudget} - €${maxBudget}${suffix}`;
  };

  // Loading state
  if (loading || dataLoading) {
    return (
      <div
        className="min-h-screen mobile-safe flex items-center justify-center"
        style={{ background: "#F8FAFC" }}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-gray-600">Services werden geladen...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <div
        className="min-h-screen mobile-safe flex items-center justify-center"
        style={{ background: "#F8FAFC" }}
      >
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={loadServicesData}
            className="btn-primary px-6 py-3 rounded-lg"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!user || user.role !== "seller") {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <div
        className="min-h-screen mobile-safe"
        style={{ background: "#F8FAFC" }}
      >
        {/* Header Component */}
        <Header
          variant="dashboard"
          user={{
            name: user.name,
            email: user.email,
            isVerified: true,
            type: "provider",
          }}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-color mb-2">
                  Meine <span className="primary-color">Services</span>
                </h1>
                <p className="text-muted text-sm sm:text-base">
                  Verwalten Sie Ihre angebotenen Dienstleistungen und erreichen
                  Sie neue Kunden
                </p>
              </div>
              <Link
                href="/services/create"
                className="btn-primary mt-4 sm:mt-0 px-6 py-3 rounded-lg font-medium text-sm flex items-center space-x-2 touch-action"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Neuen Service erstellen</span>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="professional-card p-4 sm:p-6 text-center stagger-1 slide-up">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  style={{ backgroundColor: "#0E2A6D" }}
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2"
                    />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium text-muted mb-1">
                  Aktive Services
                </p>
                <p className="text-2xl sm:text-3xl font-bold primary-color">
                  {userStats.activeServices}
                </p>
              </div>

              <div className="professional-card p-4 sm:p-6 text-center stagger-2 slide-up">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  style={{ backgroundColor: "#1A4DB3" }}
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10a1 1 0 01-1 1H7a1 1 0 01-1-1L5 9z"
                    />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium text-muted mb-1">
                  Gesamtbestellungen
                </p>
                <p className="text-2xl sm:text-3xl font-bold primary-color">
                  {userStats.totalOrders}
                </p>
              </div>

              <div className="professional-card p-4 sm:p-6 text-center stagger-3 slide-up">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  style={{ backgroundColor: "#0EA5E9" }}
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium text-muted mb-1">
                  Ø Bewertung
                </p>
                <div className="flex items-center justify-center space-x-1">
                  <p className="text-2xl sm:text-3xl font-bold primary-color">
                    {userStats.averageRating > 0
                      ? userStats.averageRating.toFixed(1)
                      : "0.0"}
                  </p>
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              <div className="professional-card p-4 sm:p-6 text-center stagger-4 slide-up">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  style={{ backgroundColor: "#10B981" }}
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium text-muted mb-1">
                  Service-Gebiete
                </p>
                <p className="text-2xl sm:text-3xl font-bold primary-color">
                  {services.length}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Filters Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Services durchsuchen..."
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 lg:ml-6">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium touch-action transition-all ${
                    selectedCategory === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Alle
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium touch-action transition-all ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                className={`professional-card overflow-hidden stagger-${
                  (index % 4) + 1
                } slide-up`}
              >
                {/* Service Image */}
                {service.images && service.images.length > 0 && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Service Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-color text-lg leading-tight">
                          {service.title}
                        </h3>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            service.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                          title={service.isActive ? "Aktiv" : "Inaktiv"}
                        />
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted mb-2">
                        <span className="font-medium">{service.category}</span>
                      </div>
                      <p className="text-sm text-muted leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    {/* Status Toggle */}
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={service.isActive || false}
                          onChange={() => toggleServiceStatus(service.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className="text-lg font-bold primary-color">
                          {service.rating ? service.rating.toFixed(1) : "0.0"}
                        </span>
                        <svg
                          className="w-4 h-4 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <p className="text-xs text-muted">Bewertung</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold primary-color">
                        {service.reviewCount || 0}
                      </p>
                      <p className="text-xs text-muted">Bestellungen</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-muted mb-1">
                        Erstellt
                      </p>
                      <p className="text-xs text-muted">
                        {service.createdAt
                          ? service.createdAt.toLocaleDateString("de-DE")
                          : "Unbekannt"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span className="font-semibold text-color">
                        {formatPriceRange(service.minBudget, service.maxBudget)}
                      </span>
                    </div>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: service.isActive
                          ? "#DCFCE7"
                          : "#FEE2E2",
                        color: service.isActive ? "#166534" : "#DC2626",
                      }}
                    >
                      {service.isActive ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      href={`/services/${service.id}/edit`}
                      className="btn-primary text-center py-2 text-xs font-medium rounded-lg flex items-center justify-center space-x-1 touch-action"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Bearbeiten</span>
                    </Link>
                    <Link
                      href={`/services/${service.id}/stats`}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-center py-2 text-xs font-medium rounded-lg flex items-center justify-center space-x-1 touch-action transition-all"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm10 0v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm-5-8V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v4"
                        />
                      </svg>
                      <span>Statistiken</span>
                    </Link>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 text-center py-2 text-xs font-medium rounded-lg flex items-center justify-center space-x-1 touch-action transition-all"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>Löschen</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "#F1F5F9" }}
              >
                <svg
                  className="w-8 h-8 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-color mb-2">
                {searchQuery || selectedCategory !== "all"
                  ? "Keine Services gefunden."
                  : "Noch keine Services erstellt"}
              </h3>
              <p className="text-muted text-lg mb-4">
                {searchQuery || selectedCategory !== "all"
                  ? "Versuchen Sie andere Suchbegriffe oder Filter."
                  : "Erstellen Sie Ihren ersten Service und starten Sie Ihr Business!"}
              </p>
              <Link
                href="/services/create"
                className="btn-primary px-6 py-3 rounded-lg font-medium text-sm flex items-center space-x-2 mx-auto w-fit"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Service erstellen</span>
              </Link>
            </div>
          )}
        </main>

        {/* Footer Component */}
        <Footer />

        {/* Mobile Bottom Navigation */}
        <div
          className="fixed bottom-0 left-0 right-0 lg:hidden glass-effect border-t z-40"
          style={{ borderColor: "rgba(11, 18, 32, 0.08)" }}
        >
          <div className="grid grid-cols-4 gap-1 px-4 py-3">
            {[
              {
                href: "/dashboard",
                icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                label: "Home",
              },
              {
                href: "/services",
                icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2",
                label: "Services",
                active: true,
              },
              {
                href: "/messages",
                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                label: "Chat",
              },
              {
                href: "/profile",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                label: "Profil",
              },
            ].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`touch-action flex flex-col items-center py-2 px-2 rounded-lg subtle-animation ${
                  item.active ? "text-white" : "text-muted hover:text-color"
                }`}
                style={item.active ? { backgroundColor: "#0E2A6D" } : {}}
              >
                <svg
                  className="w-5 h-5 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={item.active ? 2.5 : 2}
                    d={item.icon}
                  />
                </svg>
                <span
                  className={`text-xs font-medium ${
                    item.active ? "font-semibold" : ""
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyServicesPage;
