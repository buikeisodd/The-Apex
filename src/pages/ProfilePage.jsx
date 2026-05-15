import { useState, useRef } from "react";
import {
  Settings,
  Camera,
  Edit3,
  Save,
  X,
  LogOut,
  Trash2,
  Moon,
  Sun,
  Palette,
  Bookmark,
  Bell,
  Shield,
  ChevronRight,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const AVATAR_EMOJIS = [
  "🎵",
  "🎤",
  "🎸",
  "🎹",
  "🎺",
  "🎻",
  "🥁",
  "🎛️",
  "🎧",
  "🎼",
  "🌟",
  "🔥",
  "💎",
  "👑",
  "🦁",
  "🐉",
  "🌊",
  "⚡",
  "🌙",
  "🎭",
];
const AVATAR_COLORS = [
  "#D4A843",
  "#F04040",
  "#34C77B",
  "#4A8FE8",
  "#8B5CF6",
  "#E84C6A",
  "#F97316",
  "#06B6D4",
  "#84CC16",
  "#EC4899",
];

function AvatarDisplay({ user, size = 80 }) {
  const isEmoji = user?.avatarType === "emoji";
  const isImage = user?.avatarType === "image";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: isImage
          ? "transparent"
          : `linear-gradient(135deg, ${user?.avatarColor || "#D4A843"}66, ${user?.avatarColor || "#D4A843"}22)`,
        border: `2px solid ${user?.avatarColor || "#D4A843"}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {isImage ? (
        <img
          src={user.avatarValue}
          alt="avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span
          style={{
            fontSize: isEmoji ? size * 0.45 : size * 0.38,
            fontWeight: isEmoji ? 400 : 800,
            color: user?.avatarColor || "#D4A843",
            lineHeight: 1,
          }}
        >
          {user?.avatarValue || user?.name?.[0] || "?"}
        </span>
      )}
    </div>
  );
}

function DeleteAccountModal({ onClose, onConfirm }) {
  const [typed, setTyped] = useState("");
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="animate-scaleIn card"
        style={{
          borderRadius: "var(--radius-xl)",
          padding: "2rem",
          width: "100%",
          maxWidth: 420,
          background: "var(--surface)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(240,64,64,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <AlertTriangle size={26} style={{ color: "#F04040" }} />
          </div>
          <h2
            style={{
              fontFamily: "Bebas Neue",
              fontSize: "1.6rem",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
          >
            DELETE ACCOUNT
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              lineHeight: 1.7,
            }}
          >
            This will permanently delete your account and all associated data.
            This action{" "}
            <strong style={{ color: "#F04040" }}>cannot be undone</strong>.
          </p>
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Type{" "}
            <span style={{ color: "#F04040", fontFamily: "DM Mono" }}>
              DELETE
            </span>{" "}
            to confirm
          </label>
          <input
            className="input-dark"
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              border: typed === "DELETE" ? "1px solid #F04040" : undefined,
            }}
            placeholder="DELETE"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <button
            onClick={onClose}
            className="btn-outline"
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-md)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={typed !== "DELETE"}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-md)",
              background:
                typed === "DELETE" ? "#F04040" : "rgba(240,64,64,0.2)",
              color: "#fff",
              border: "none",
              cursor: typed === "DELETE" ? "pointer" : "not-allowed",
              fontWeight: 700,
              fontSize: "0.875rem",
              transition: "all 0.2s",
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({ setActivePage }) {
  const {
    user,
    logout,
    updateProfile,
    deleteAccount,
    saved,
    beats,
    bookings,
    changeTheme,
    theme,
    THEMES,
  } = useApp();
  const [tab, setTab] = useState("profile"); // profile | settings
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [avatarPanel, setAvatarPanel] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    city: user?.city || "",
    country: user?.country || "",
  });
  const fileRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    updateProfile({
      ...user,
      name: `${form.firstName} ${form.lastName}`,
      bio: form.bio,
      phone: form.phone,
      city: form.city,
      country: form.country,
    });
    setEditing(false);
  };

  const handleAvatarEmoji = (emoji) => {
    updateProfile({ ...user, avatarType: "emoji", avatarValue: emoji });
    setAvatarPanel(false);
  };

  const handleAvatarColor = (color) => {
    updateProfile({ ...user, avatarColor: color });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateProfile({
        ...user,
        avatarType: "image",
        avatarValue: ev.target.result,
      });
      setAvatarPanel(false);
    };
    reader.readAsDataURL(file);
  };

  const myBookings = bookings.filter((b) => b.clientEmail === user?.email);
  const mySaved = saved;
  const myBeats = beats.filter((b) => b.producer === user?.name);

  const roleColor =
    { client: "#34C77B", producer: "#D4A843", admin: "#F04040" }[user?.role] ||
    "#D4A843";

  return (
    <div
      style={{ paddingTop: 68, minHeight: "100vh", background: "var(--bg)" }}
    >
      {/* ── Profile Header ────────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--bg-raised)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative" }}>
              <AvatarDisplay user={user} size={88} />
              <button
                onClick={() => setAvatarPanel(!avatarPanel)}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--gold)",
                  border: "2px solid var(--bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Camera size={13} style={{ color: "#000" }} />
              </button>
            </div>

            {/* Name + info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginBottom: "0.375rem",
                }}
              >
                <h1
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}
                >
                  {user?.name}
                </h1>
                <span
                  style={{
                    fontSize: "0.6rem",
                    padding: "2px 8px",
                    borderRadius: 10,
                    background: `${roleColor}18`,
                    color: roleColor,
                    border: `1px solid ${roleColor}35`,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {user?.role}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  marginBottom: "0.5rem",
                  fontFamily: "DM Mono",
                }}
              >
                {user?.email}
              </p>
              {user?.bio && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.65,
                    maxWidth: 480,
                  }}
                >
                  {user.bio}
                </p>
              )}
              {(user?.city || user?.country) && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: "0.4rem",
                  }}
                >
                  📍 {[user.city, user.country].filter(Boolean).join(", ")}
                </p>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  setTab("settings");
                  setEditing(false);
                }}
                className="btn-outline"
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Settings size={14} /> Settings
              </button>
              <button
                onClick={() => {
                  setEditing(!editing);
                  setTab("profile");
                }}
                className={editing ? "btn-outline" : "btn-gold"}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {editing ? (
                  <>
                    <X size={14} /> Cancel
                  </>
                ) : (
                  <>
                    <Edit3 size={14} /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Avatar panel */}
          {avatarPanel && (
            <div
              className="animate-fadeDown card"
              style={{
                marginTop: "1.25rem",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}
                >
                  Choose Avatar
                </p>
                <button
                  onClick={() => setAvatarPanel(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
              {/* Upload */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileRef.current.click()}
                className="btn-outline"
                style={{
                  width: "100%",
                  padding: "9px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.82rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Camera size={15} /> Upload Custom Photo
              </button>
              {/* Emoji grid */}
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.625rem",
                }}
              >
                Or pick an emoji avatar
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  marginBottom: "1rem",
                }}
              >
                {AVATAR_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => handleAvatarEmoji(e)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background:
                        user?.avatarValue === e
                          ? "rgba(212,168,67,0.15)"
                          : "var(--surface2)",
                      border:
                        user?.avatarValue === e
                          ? "1px solid var(--gold)"
                          : "1px solid rgba(255,255,255,0.06)",
                      fontSize: "1.3rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
              {/* Color picker */}
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.625rem",
                }}
              >
                Avatar accent colour
              </p>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleAvatarColor(c)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: c,
                      border:
                        user?.avatarColor === c
                          ? "2px solid #fff"
                          : "2px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {user?.avatarColor === c && (
                      <Check size={12} style={{ color: "#000" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginTop: "1.75rem",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {["profile", "settings"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "0.625rem 1.25rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: tab === t ? "var(--gold)" : "var(--text-muted)",
                  borderBottom:
                    tab === t
                      ? "2px solid var(--gold)"
                      : "2px solid transparent",
                  transition: "all 0.2s",
                  marginBottom: -1,
                }}
              >
                {t === "profile" ? "Profile" : " Settings"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.5rem 4rem" }}>
        {/* ── PROFILE TAB ────────────────────────────────────────────────── */}
        {tab === "profile" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "2rem",
            }}
            className="profile-grid"
          >
            {/* Edit form or stats */}
            <div>
              {editing ? (
                <div
                  className="card"
                  style={{
                    borderRadius: "var(--radius-xl)",
                    padding: "1.75rem",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "Bebas Neue",
                      fontSize: "1.3rem",
                      letterSpacing: "0.1em",
                      marginBottom: "1.25rem",
                      color: "var(--gold)",
                    }}
                  >
                    EDIT PROFILE
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.75rem",
                      }}
                    >
                      {[
                        ["firstName", "First Name"],
                        ["lastName", "Last Name"],
                      ].map(([k, l]) => (
                        <div key={k}>
                          <label
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "var(--text-muted)",
                              display: "block",
                              marginBottom: "0.4rem",
                            }}
                          >
                            {l}
                          </label>
                          <input
                            className="input-dark"
                            style={{
                              padding: "10px 14px",
                              borderRadius: "var(--radius-md)",
                              fontSize: "0.875rem",
                            }}
                            value={form[k]}
                            onChange={(e) => set(k, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    {[
                      ["phone", "Phone Number"],
                      ["city", "City"],
                      ["country", "Country"],
                    ].map(([k, l]) => (
                      <div key={k}>
                        <label
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                            display: "block",
                            marginBottom: "0.4rem",
                          }}
                        >
                          {l}
                        </label>
                        <input
                          className="input-dark"
                          style={{
                            padding: "10px 14px",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.875rem",
                          }}
                          value={form[k]}
                          onChange={(e) => set(k, e.target.value)}
                        />
                      </div>
                    ))}
                    <div>
                      <label
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          display: "block",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Bio
                      </label>
                      <textarea
                        className="input-dark"
                        style={{
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.875rem",
                          resize: "vertical",
                          minHeight: 90,
                          lineHeight: 1.65,
                        }}
                        value={form.bio}
                        onChange={(e) => set("bio", e.target.value)}
                        maxLength={300}
                      />
                      <p
                        style={{
                          fontSize: "0.62rem",
                          color: "var(--text-muted)",
                          textAlign: "right",
                          marginTop: "0.2rem",
                        }}
                      >
                        {form.bio.length}/300
                      </p>
                    </div>
                    <button
                      onClick={handleSave}
                      className="btn-gold"
                      style={{
                        padding: "11px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <Save size={15} /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Stats */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(130px, 1fr))",
                      gap: "1rem",
                      marginBottom: "2rem",
                    }}
                  >
                    {user?.role === "client" &&
                      [
                        { label: "Bookings", value: myBookings.length },
                        { label: "Saved Beats", value: mySaved.length },
                        {
                          label: "Purchases",
                          value: myBookings.filter(
                            (b) => b.paymentStatus === "full_paid",
                          ).length,
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="card"
                          style={{
                            borderRadius: "var(--radius-lg)",
                            padding: "1.25rem",
                            textAlign: "center",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "Bebas Neue",
                              fontSize: "2rem",
                              color: "var(--gold)",
                              letterSpacing: "0.04em",
                              lineHeight: 1,
                            }}
                          >
                            {s.value}
                          </p>
                          <p
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              marginTop: "0.25rem",
                            }}
                          >
                            {s.label}
                          </p>
                        </div>
                      ))}
                    {user?.role === "producer" &&
                      [
                        { label: "Beats", value: myBeats.length },
                        {
                          label: "Sessions",
                          value: bookings.filter(
                            (b) => b.assignedProducer === user?.name,
                          ).length,
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="card"
                          style={{
                            borderRadius: "var(--radius-lg)",
                            padding: "1.25rem",
                            textAlign: "center",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "Bebas Neue",
                              fontSize: "2rem",
                              color: "var(--gold)",
                              letterSpacing: "0.04em",
                              lineHeight: 1,
                            }}
                          >
                            {s.value}
                          </p>
                          <p
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              marginTop: "0.25rem",
                            }}
                          >
                            {s.label}
                          </p>
                        </div>
                      ))}
                  </div>

                  {/* Saved beats */}
                  {user?.role === "client" && mySaved.length > 0 && (
                    <div
                      className="card"
                      style={{
                        borderRadius: "var(--radius-xl)",
                        padding: "1.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <h3
                          style={{
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Bookmark
                            size={16}
                            style={{ color: "var(--gold)" }}
                          />{" "}
                          Saved Beats
                        </h3>
                        <button
                          onClick={() => setActivePage("beats")}
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--gold)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Browse All →
                        </button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.625rem",
                        }}
                      >
                        {mySaved.map((b) => (
                          <div
                            key={b.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.875rem",
                              padding: "0.625rem",
                              borderRadius: "var(--radius-md)",
                              background: "var(--surface2)",
                            }}
                          >
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                background: `hsl(${b.id * 47},30%,12%)`,
                                flexShrink: 0,
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  fontWeight: 700,
                                  fontSize: "0.85rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {b.title}
                              </p>
                              <p
                                style={{
                                  fontSize: "0.7rem",
                                  color: "var(--text-muted)",
                                  fontFamily: "DM Mono",
                                }}
                              >
                                {b.producer} · ${b.price}
                              </p>
                            </div>
                            <button
                              onClick={() => setActivePage("beats")}
                              className="btn-gold"
                              style={{
                                padding: "5px 12px",
                                borderRadius: 8,
                                fontSize: "0.72rem",
                                flexShrink: 0,
                              }}
                            >
                              Buy
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                className="card"
                style={{ borderRadius: "var(--radius-xl)", padding: "1.25rem" }}
              >
                <p
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "1rem",
                  }}
                >
                  Account Info
                </p>
                {[
                  ["Role", user?.role],
                  ["Provider", user?.provider || "Email"],
                  [
                    "Joined",
                    user?.joinedAt
                      ? new Date(user.joinedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—",
                  ],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      fontSize: "0.82rem",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>{k}</span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: k === "Role" ? "var(--gold)" : "var(--text)",
                        textTransform: k === "Role" ? "capitalize" : "none",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ───────────────────────────────────────────────── */}
        {tab === "settings" && (
          <div
            style={{
              maxWidth: 600,
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* Theme */}
            <div
              className="card"
              style={{ borderRadius: "var(--radius-xl)", padding: "1.5rem" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(212,168,67,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Palette size={18} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                    App Theme
                  </p>
                  <p
                    style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}
                  >
                    Choose your visual style
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "0.625rem",
                }}
              >
                {Object.entries(THEMES).map(([key, th]) => (
                  <button
                    key={key}
                    onClick={() => changeTheme(key)}
                    style={{
                      padding: "0.875rem",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      border:
                        theme === key
                          ? `1px solid ${th.gold}`
                          : "1px solid rgba(255,255,255,0.07)",
                      background: th.surface,
                      transition: "all 0.2s",
                      textAlign: "left",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 5,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {[th.bg, th.surface, th.gold].map((c, i) => (
                        <div
                          key={i}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            background: c,
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: th.text,
                      }}
                    >
                      {th.name}
                    </p>
                    {theme === key && (
                      <Check
                        size={12}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: th.gold,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Account actions */}
            <div
              className="card"
              style={{ borderRadius: "var(--radius-xl)", padding: "1.5rem" }}
            >
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Shield size={16} style={{ color: "var(--gold)" }} /> Account
                Actions
              </p>
              {[
                {
                  label: "Edit Profile",
                  desc: "Update your personal information",
                  icon: <Edit3 size={16} />,
                  action: () => {
                    setTab("profile");
                    setEditing(true);
                  },
                  color: "var(--gold)",
                },
                {
                  label: "Sign Out",
                  desc: "Log out of your account",
                  icon: <LogOut size={16} />,
                  action: logout,
                  color: "#eab308",
                },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={a.action}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.875rem",
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface2)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer",
                    marginBottom: "0.625rem",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = `${a.color}40`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.05)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span style={{ color: a.color }}>{a.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: a.color,
                        }}
                      >
                        {a.label}
                      </p>
                      <p
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {a.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    style={{ color: "var(--text-muted)" }}
                  />
                </button>
              ))}

              {/* Delete */}
              <button
                onClick={() => setShowDelete(true)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.875rem",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(240,64,64,0.06)",
                  border: "1px solid rgba(240,64,64,0.2)",
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(240,64,64,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(240,64,64,0.06)")
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Trash2 size={16} style={{ color: "#F04040" }} />
                  <div style={{ textAlign: "left" }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "#F04040",
                      }}
                    >
                      Delete Account
                    </p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      Permanently remove your account and all data
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: "#F04040" }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showDelete && (
        <DeleteAccountModal
          onClose={() => setShowDelete(false)}
          onConfirm={() => {
            deleteAccount();
            setShowDelete(false);
          }}
        />
      )}
      <style>{`@media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
