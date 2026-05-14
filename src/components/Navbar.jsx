import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, LogOut, Bell, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";

function ApexLogo({ size = 34 }) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <circle
        cx="26"
        cy="26"
        r="25"
        stroke="url(#nl1)"
        strokeWidth="1.5"
        fill="url(#nl2)"
      />
      <circle
        cx="26"
        cy="26"
        r="10"
        stroke="url(#nl1)"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <circle cx="26" cy="26" r="4" fill="#D4A843" />
      <line
        x1="26"
        y1="1"
        x2="26"
        y2="16"
        stroke="url(#nl1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="26"
        y1="36"
        x2="26"
        y2="51"
        stroke="url(#nl1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="26"
        x2="16"
        y2="26"
        stroke="url(#nl1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="36"
        y1="26"
        x2="51"
        y2="26"
        stroke="url(#nl1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="nl1"
          x1="0"
          y1="0"
          x2="52"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F0C860" />
          <stop offset="1" stopColor="#96721E" />
        </linearGradient>
        <radialGradient id="nl2" cx="50%" cy="30%" r="70%">
          <stop stopColor="#1A1A24" />
          <stop offset="1" stopColor="#0D0D10" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function Navbar({
  activePage,
  setActivePage,
  onAuthOpen,
  onProfileOpen,
}) {
  const { user, logout, cart, notifications } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const myNotifs =
    user?.role === "producer" ? notifications[user.name] || [] : [];
  const unreadCount = myNotifs.filter((n) => !n.read).length;

  const clientLinks = [
    { id: "home", label: "Home" },
    { id: "beats", label: "Beats" },
    { id: "sessions", label: "Sessions" },
    { id: "explore", label: "Explore" },
    { id: "contact", label: "Contact" },
  ];
  const producerLinks = [
    { id: "dashboard", label: "Dashboard" },
    { id: "upload", label: "Upload" },
    { id: "mybeats", label: "My Beats" },
    { id: "explore", label: "Explore" },
    { id: "notifications", label: "Notifications" },
  ];
  const adminLinks = [
    { id: "admin-overview", label: "Overview" },
    { id: "admin-bookings", label: "Bookings" },
    { id: "admin-beats", label: "Beats" },
    { id: "admin-users", label: "Users" },
    { id: "admin-transactions", label: "Transactions" },
    { id: "admin-producers", label: "Producers" },
  ];
  const links =
    user?.role === "producer"
      ? producerLinks
      : user?.role === "admin"
        ? adminLinks
        : clientLinks;

  const nav = (id) => {
    setActivePage(id);
    setMenuOpen(false);
    setDropOpen(false);
  };

  const roleColors = {
    admin: "#F04040",
    producer: "#D4A843",
    client: "#34C77B",
  };
  const roleColor = roleColors[user?.role] || "var(--gold)";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(6,6,8,0.97)" : "rgba(6,6,8,0.55)",
        backdropFilter: "blur(24px) saturate(1.4)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid transparent",
        transition: "all 0.35s var(--ease-out)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
          padding: "0 1.5rem",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => nav("home")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
          }}
        >
          <ApexLogo size={34} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: "Bebas Neue",
                fontSize: "1.2rem",
                letterSpacing: "0.18em",
                color: "var(--text)",
                lineHeight: 1,
              }}
            >
              APEX LABEL
            </span>
            {user?.role && (
              <span
                style={{
                  fontSize: "0.54rem",
                  padding: "1px 6px",
                  borderRadius: 3,
                  background: `${roleColor}20`,
                  color: roleColor,
                  border: `1px solid ${roleColor}40`,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {user.role}
              </span>
            )}
          </div>
        </button>

        {/* Desktop nav */}
        <nav
          className="hidden-mobile"
          style={{ display: "flex", gap: "2rem", alignItems: "center" }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => nav(l.id)}
              className={`nav-link ${activePage === l.id ? "active" : ""}`}
              style={{
                background: "none",
                border: "none",
                position: "relative",
              }}
            >
              {l.label}
              {l.id === "notifications" && unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -7,
                    right: -9,
                    background: "var(--red)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 15,
                    height: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.5rem",
                    fontWeight: 700,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user?.role === "client" && (
            <button
              onClick={() => nav("cart")}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 7,
                borderRadius: 8,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <ShoppingCart
                size={19}
                style={{
                  color:
                    activePage === "cart"
                      ? "var(--gold)"
                      : "var(--text-secondary)",
                }}
              />
              {cart.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    background: "var(--gold)",
                    color: "#000",
                    borderRadius: "50%",
                    width: 14,
                    height: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.48rem",
                    fontWeight: 700,
                  }}
                >
                  {cart.length}
                </span>
              )}
            </button>
          )}
          {user?.role === "producer" && unreadCount > 0 && (
            <button
              onClick={() => nav("notifications")}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 7,
                borderRadius: 8,
              }}
            >
              <Bell size={19} style={{ color: "var(--gold)" }} />
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  right: 3,
                  background: "var(--red)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 14,
                  height: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.48rem",
                  fontWeight: 700,
                }}
              >
                {unreadCount}
              </span>
            </button>
          )}

          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--surface2)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 30,
                  padding: "4px 10px 4px 4px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")
                }
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${roleColor}cc, ${roleColor}66)`,
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.72rem",
                    flexShrink: 0,
                  }}
                >
                  {user.avatar || user.name?.[0] || "U"}
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    maxWidth: 72,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  className="hidden-mobile"
                >
                  {user.name?.split(" ")[0]}
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    color: "var(--text-muted)",
                    transform: dropOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                />
              </button>

              {dropOpen && (
                <div
                  className="animate-fadeDown"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 46,
                    background: "var(--surface2)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.5rem",
                    minWidth: 195,
                    zIndex: 200,
                    boxShadow: "var(--shadow-lg)",
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem 0.875rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        marginBottom: "0.15rem",
                      }}
                    >
                      {user.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {user.email}
                    </p>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        padding: "2px 7px",
                        borderRadius: 3,
                        background: `${roleColor}18`,
                        color: roleColor,
                        border: `1px solid ${roleColor}35`,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setDropOpen(false);
                      if (onProfileOpen) onProfileOpen();
                      else nav("profile");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "0.625rem 0.875rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      borderRadius: 7,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(212,168,67,0.08)";
                      e.currentTarget.style.color = "var(--gold)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    <span style={{ fontSize: "0.875rem" }}>👤</span> My Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setDropOpen(false);
                      nav("home");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "0.625rem 0.875rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      borderRadius: 7,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(240,64,64,0.08)";
                      e.currentTarget.style.color = "var(--red)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onAuthOpen}
              className="btn-gold"
              style={{
                padding: "8px 18px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.78rem",
              }}
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
            }}
          >
            {menuOpen ? (
              <X size={20} style={{ color: "var(--text)" }} />
            ) : (
              <Menu size={20} style={{ color: "var(--text)" }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="animate-fadeDown"
          style={{
            background: "var(--surface)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "1rem 1.5rem 1.5rem",
          }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => nav(l.id)}
              className={`nav-link ${activePage === l.id ? "active" : ""}`}
              style={{
                display: "block",
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "0.75rem 0",
                width: "100%",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
