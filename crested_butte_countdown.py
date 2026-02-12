import streamlit as st
from datetime import datetime
import time
import requests

# App version
APP_VERSION = "1.7"

# Page configuration - MUST be first Streamlit command
st.set_page_config(
    page_title="Crested Butte Trip Countdown",
    page_icon="🏔️",
    layout="wide"
)

# GitHub raw URL for images
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/weljim73-spec/crestedbutte2026countdown/main"

# Crested Butte Mountain coordinates
CB_LAT = 38.8697
CB_LON = -106.9878

# Function to fetch snow conditions from Open-Meteo API
@st.cache_data(ttl=1800)  # Cache for 30 minutes
def get_snow_conditions():
    """Fetch current weather and snow conditions for Crested Butte."""
    max_retries = 3
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": CB_LAT,
        "longitude": CB_LON,
        "current": "temperature_2m,weather_code,wind_speed_10m,snow_depth",
        "daily": "snowfall_sum,temperature_2m_max,temperature_2m_min,precipitation_sum",
        "timezone": "America/Denver",
        "forecast_days": 7,
        "temperature_unit": "fahrenheit",
        "wind_speed_unit": "mph",
        "precipitation_unit": "inch"
    }
    for attempt in range(max_retries):
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                return response.json()
        except Exception:
            pass
        if attempt < max_retries - 1:
            time.sleep(2 ** attempt)  # Exponential backoff: 1s, 2s
    raise RuntimeError("Failed to fetch snow conditions after retries")

# Open Graph meta tags for link previews
st.markdown(f"""
<meta property="og:title" content="Crested Butte Trip Countdown" />
<meta property="og:description" content="Counting down to our ski adventure in Crested Butte, Colorado - March 14, 2026!" />
<meta property="og:image" content="{GITHUB_RAW_BASE}/preview.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Crested Butte Trip Countdown" />
<meta name="twitter:description" content="Counting down to our ski adventure in Crested Butte, Colorado!" />
<meta name="twitter:image" content="{GITHUB_RAW_BASE}/preview.png" />
""", unsafe_allow_html=True)

# Version display - top left corner
st.caption(f"v{APP_VERSION}")

# Build image URLs list for 10 images
image_urls = [f"{GITHUB_RAW_BASE}/image{str(i).zfill(2)}.jpg" for i in range(1, 11)]

# Custom CSS for styling with slideshow and snow effect
st.markdown("""
<style>
    /* Snow animation */
    .snowflakes {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    }

    .snowflake {
        position: absolute;
        top: -20px;
        color: white;
        font-size: 1.5em;
        text-shadow: 0 0 5px rgba(255,255,255,0.8);
        animation: fall linear infinite;
        opacity: 0.8;
    }

    @keyframes fall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.3;
        }
    }

    /* Different snowflake positions and speeds */
    .snowflake:nth-child(1) { left: 5%; animation-duration: 8s; animation-delay: 0s; font-size: 1.2em; }
    .snowflake:nth-child(2) { left: 10%; animation-duration: 12s; animation-delay: 1s; font-size: 1.8em; }
    .snowflake:nth-child(3) { left: 15%; animation-duration: 10s; animation-delay: 2s; font-size: 1em; }
    .snowflake:nth-child(4) { left: 20%; animation-duration: 14s; animation-delay: 0.5s; font-size: 1.5em; }
    .snowflake:nth-child(5) { left: 25%; animation-duration: 9s; animation-delay: 3s; font-size: 1.3em; }
    .snowflake:nth-child(6) { left: 30%; animation-duration: 11s; animation-delay: 1.5s; font-size: 2em; }
    .snowflake:nth-child(7) { left: 35%; animation-duration: 13s; animation-delay: 2.5s; font-size: 1.1em; }
    .snowflake:nth-child(8) { left: 40%; animation-duration: 8s; animation-delay: 4s; font-size: 1.6em; }
    .snowflake:nth-child(9) { left: 45%; animation-duration: 10s; animation-delay: 0.8s; font-size: 1.4em; }
    .snowflake:nth-child(10) { left: 50%; animation-duration: 15s; animation-delay: 3.5s; font-size: 1.9em; }
    .snowflake:nth-child(11) { left: 55%; animation-duration: 9s; animation-delay: 1.2s; font-size: 1.2em; }
    .snowflake:nth-child(12) { left: 60%; animation-duration: 12s; animation-delay: 2.8s; font-size: 1.7em; }
    .snowflake:nth-child(13) { left: 65%; animation-duration: 11s; animation-delay: 0.3s; font-size: 1em; }
    .snowflake:nth-child(14) { left: 70%; animation-duration: 14s; animation-delay: 4.5s; font-size: 1.5em; }
    .snowflake:nth-child(15) { left: 75%; animation-duration: 8s; animation-delay: 1.8s; font-size: 1.3em; }
    .snowflake:nth-child(16) { left: 80%; animation-duration: 10s; animation-delay: 3.2s; font-size: 2.1em; }
    .snowflake:nth-child(17) { left: 85%; animation-duration: 13s; animation-delay: 0.6s; font-size: 1.1em; }
    .snowflake:nth-child(18) { left: 90%; animation-duration: 9s; animation-delay: 2.2s; font-size: 1.8em; }
    .snowflake:nth-child(19) { left: 95%; animation-duration: 11s; animation-delay: 4.2s; font-size: 1.4em; }
    .snowflake:nth-child(20) { left: 3%; animation-duration: 12s; animation-delay: 1.7s; font-size: 1.6em; }

    .countdown-container {
        text-align: center;
        padding: 20px;
    }
    .countdown-title {
        font-size: 2.5rem;
        color: #1E88E5;
        margin-bottom: 10px;
    }
    .countdown-subtitle {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 30px;
    }

    /* Countdown flexbox - always horizontal */
    .countdown-flex {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: nowrap;
        margin: 20px 0;
    }
    .countdown-flex .time-unit {
        flex: 1 1 0;
        max-width: 140px;
        text-align: center;
    }
    .time-value {
        font-size: 3.5rem;
        font-weight: bold;
        color: #2E7D32;
        background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
        padding: 20px 25px;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        min-width: 60px;
        display: block;
    }
    .time-label {
        font-size: 1rem;
        color: #666;
        margin-top: 10px;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .mountain-emoji {
        font-size: 4rem;
        margin: 20px 0;
        text-align: center;
    }

    /* Slideshow styles */
    .slideshow-container {
        position: relative;
        width: 100%;
        max-width: 800px;
        height: 400px;
        margin: 30px auto;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        background-color: #000;
    }

    .slideshow-container img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        opacity: 0;
        animation: fadeInOut 50s infinite;
    }

    /* Stagger the animations for each image */
    .slideshow-container img:nth-child(1) { animation-delay: 0s; }
    .slideshow-container img:nth-child(2) { animation-delay: 5s; }
    .slideshow-container img:nth-child(3) { animation-delay: 10s; }
    .slideshow-container img:nth-child(4) { animation-delay: 15s; }
    .slideshow-container img:nth-child(5) { animation-delay: 20s; }
    .slideshow-container img:nth-child(6) { animation-delay: 25s; }
    .slideshow-container img:nth-child(7) { animation-delay: 30s; }
    .slideshow-container img:nth-child(8) { animation-delay: 35s; }
    .slideshow-container img:nth-child(9) { animation-delay: 40s; }
    .slideshow-container img:nth-child(10) { animation-delay: 45s; }

    @keyframes fadeInOut {
        0% { opacity: 0; }
        2% { opacity: 1; }
        10% { opacity: 1; }
        12% { opacity: 0; }
        100% { opacity: 0; }
    }

    /* Snow conditions styling */
    .snow-metric {
        background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
        padding: 4px;
        border-radius: 5px;
        margin: 3px 0;
        text-align: center;
    }
    .snow-metric-value {
        font-size: 0.9rem;
        font-weight: bold;
        color: #1565C0;
    }
    .snow-metric-label {
        font-size: 0.5rem;
        color: #666;
        text-transform: uppercase;
    }
    .snow-updated-badge {
        text-align: center;
        font-size: 0.55rem;
        color: #90A4AE;
        margin-bottom: 4px;
    }

    /* ===== Mobile-first layout ===== */
    /* Default (mobile): single column, natural DOM order */
    .layout-wrapper {
        display: block;
    }
    .layout-main {
        order: 1;
    }
    .layout-weather {
        order: 2;
        margin-top: 20px;
    }

    /* Desktop: CSS grid with weather as left sidebar */
    @media (min-width: 769px) {
        .layout-wrapper {
            display: grid;
            grid-template-columns: 1fr 3fr;
            gap: 20px;
            align-items: start;
        }
        .layout-main {
            order: 2;
        }
        .layout-weather {
            order: 1;
            margin-top: 280px;
        }
    }

    /* Mobile responsive styles */
    @media (max-width: 768px) {
        .mountain-emoji {
            margin-top: 0 !important;
            padding-top: 0 !important;
        }
        .countdown-title {
            font-size: 1.5rem !important;
        }
        .countdown-subtitle {
            font-size: 1rem !important;
        }
        .countdown-flex .time-value {
            font-size: 2rem !important;
            padding: 10px 8px !important;
            min-width: 45px !important;
        }
        .countdown-flex .time-label {
            font-size: 0.7rem !important;
            letter-spacing: 1px !important;
        }
        .slideshow-container {
            height: 250px !important;
            max-width: 100% !important;
            margin: 15px auto !important;
        }
        .mountain-emoji {
            font-size: 2.5rem !important;
        }
        .snow-metric {
            padding: 3px !important;
            margin: 2px 0 !important;
        }
        .snow-metric-value {
            font-size: 0.8rem !important;
        }
    }

    @media (max-width: 480px) {
        .countdown-title {
            font-size: 1.2rem !important;
        }
        .countdown-flex .time-value {
            font-size: 1.5rem !important;
            padding: 8px 4px !important;
            min-width: 35px !important;
        }
        .countdown-flex .time-label {
            font-size: 0.6rem !important;
        }
        .slideshow-container {
            height: 200px !important;
        }
    }
</style>
""", unsafe_allow_html=True)

# Trip date
TRIP_DATE = datetime(2026, 3, 14, 0, 0, 0)

def calculate_countdown():
    """Calculate time remaining until the trip."""
    now = datetime.now()
    delta = TRIP_DATE - now

    if delta.total_seconds() <= 0:
        return None  # Trip has started!

    total_seconds = int(delta.total_seconds())

    weeks = total_seconds // (7 * 24 * 3600)
    remaining = total_seconds % (7 * 24 * 3600)

    days = remaining // (24 * 3600)
    remaining = remaining % (24 * 3600)

    hours = remaining // 3600
    remaining = remaining % 3600

    minutes = remaining // 60
    seconds = remaining % 60

    return {
        'weeks': weeks,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    }

# Weather code to description mapping
def get_weather_description(code):
    weather_codes = {
        0: "Clear sky ☀️",
        1: "Mainly clear 🌤️",
        2: "Partly cloudy ⛅",
        3: "Overcast ☁️",
        45: "Foggy 🌫️",
        48: "Rime fog 🌫️",
        51: "Light drizzle 🌧️",
        53: "Drizzle 🌧️",
        55: "Dense drizzle 🌧️",
        61: "Slight rain 🌧️",
        63: "Rain 🌧️",
        65: "Heavy rain 🌧️",
        71: "Slight snow 🌨️",
        73: "Snow 🌨️",
        75: "Heavy snow ❄️",
        77: "Snow grains 🌨️",
        80: "Slight showers 🌧️",
        81: "Showers 🌧️",
        82: "Violent showers 🌧️",
        85: "Slight snow showers 🌨️",
        86: "Heavy snow showers ❄️",
        95: "Thunderstorm ⛈️",
    }
    return weather_codes.get(code, "Unknown")

# === Build all content as HTML for mobile-first layout ===

# -- Main content section --
main_html = ''

# Header (icons)
main_html += '''<div class="mountain-emoji">🏔️⛷️🎿
<svg width="64" height="64" viewBox="0 0 64 64" style="vertical-align: middle; margin-left: 5px;">
  <!-- Wooden barrel base -->
  <ellipse cx="32" cy="48" rx="28" ry="10" fill="#8B4513"/>
  <rect x="4" y="28" width="56" height="20" fill="#CD853F"/>
  <ellipse cx="32" cy="28" rx="28" ry="10" fill="#DEB887"/>
  <!-- Water -->
  <ellipse cx="32" cy="28" rx="24" ry="7" fill="#87CEEB"/>
  <!-- Bubbles -->
  <circle cx="20" cy="26" r="3" fill="white" opacity="0.8"/>
  <circle cx="28" cy="24" r="2" fill="white" opacity="0.7"/>
  <circle cx="38" cy="27" r="2.5" fill="white" opacity="0.8"/>
  <circle cx="44" cy="25" r="2" fill="white" opacity="0.6"/>
  <circle cx="24" cy="29" r="1.5" fill="white" opacity="0.7"/>
  <circle cx="40" cy="30" r="1.5" fill="white" opacity="0.6"/>
</svg>
</div>'''

# Title and subtitle
main_html += '<h1 class="countdown-title">Crested Butte Trip Countdown</h1>'
main_html += '<p class="countdown-subtitle">Adventure begins: March 14, 2026</p>'

# Countdown (always-horizontal flexbox)
countdown = calculate_countdown()

if countdown is None:
    main_html += '<div style="text-align:center; font-size:2rem; color:#2E7D32;">🎉 The trip has begun! Have an amazing time in Crested Butte! 🎉</div>'
else:
    main_html += '<div class="countdown-flex">'
    for label, value, fmt in [
        ("Weeks", countdown['weeks'], str(countdown['weeks'])),
        ("Days", countdown['days'], str(countdown['days'])),
        ("Hours", countdown['hours'], f"{countdown['hours']:02d}"),
        ("Minutes", countdown['minutes'], f"{countdown['minutes']:02d}"),
        ("Seconds", countdown['seconds'], f"{countdown['seconds']:02d}"),
    ]:
        main_html += f'''<div class="time-unit">
    <div class="time-value">{fmt}</div>
    <div class="time-label">{label}</div>
</div>'''
    main_html += '</div>'

# -- Weather section --
weather_html = ''
try:
    weather_data = get_snow_conditions()
except RuntimeError:
    weather_data = None

if weather_data:
    current = weather_data.get("current", {})
    daily = weather_data.get("daily", {})

    # Last updated badge
    obs_time = current.get("time", "")
    if obs_time:
        try:
            obs_dt = datetime.strptime(obs_time, "%Y-%m-%dT%H:%M")
            updated_label = obs_dt.strftime("%-I:%M %p, %b %-d")
        except ValueError:
            updated_label = obs_time
        weather_html += f'<div class="snow-updated-badge">Updated {updated_label}</div>'

    # Current temperature
    temp = current.get("temperature_2m", "N/A")
    weather_html += f'''<div class="snow-metric">
    <div class="snow-metric-value">{temp}°F</div>
    <div class="snow-metric-label">Current Temp</div>
</div>'''

    # Weather condition
    weather_code = current.get("weather_code", 0)
    weather_desc = get_weather_description(weather_code)
    weather_html += f'''<div class="snow-metric">
    <div class="snow-metric-value" style="font-size: 0.75rem;">{weather_desc}</div>
    <div class="snow-metric-label">Conditions</div>
</div>'''

    # Snow depth - convert to inches based on the unit the API returns
    snow_depth = current.get("snow_depth")
    if snow_depth is not None:
        snow_depth_unit = weather_data.get("current_units", {}).get("snow_depth", "m")
        if snow_depth_unit == "m":
            snow_depth_inches = round(snow_depth * 39.37, 1)
        elif snow_depth_unit == "cm":
            snow_depth_inches = round(snow_depth / 2.54, 1)
        elif snow_depth_unit in ("inch", "in"):
            snow_depth_inches = round(snow_depth, 1)
        else:
            snow_depth_inches = round(snow_depth * 39.37, 1)  # assume meters
    else:
        snow_depth_inches = "N/A"
    weather_html += f'''<div class="snow-metric">
    <div class="snow-metric-value">{snow_depth_inches}"</div>
    <div class="snow-metric-label">Snow Depth</div>
</div>'''

    # 7-day snowfall forecast
    if daily.get("snowfall_sum"):
        total_7day_snow = sum(daily["snowfall_sum"])
        weather_html += f'''<div class="snow-metric">
    <div class="snow-metric-value">{total_7day_snow:.1f}"</div>
    <div class="snow-metric-label">7-Day Snow Forecast</div>
</div>'''

    # Wind speed
    wind = current.get("wind_speed_10m", "N/A")
    weather_html += f'''<div class="snow-metric">
    <div class="snow-metric-value">{wind} mph</div>
    <div class="snow-metric-label">Wind Speed</div>
</div>'''

    # High/Low today
    if daily.get("temperature_2m_max") and daily.get("temperature_2m_min"):
        high = daily["temperature_2m_max"][0]
        low = daily["temperature_2m_min"][0]
        weather_html += f'''<div class="snow-metric">
    <div class="snow-metric-value">{high}° / {low}°</div>
    <div class="snow-metric-label">High / Low Today</div>
</div>'''
else:
    weather_html += '<div style="color: orange; text-align: center;">Unable to fetch snow conditions</div>'

# -- Slideshow --
slideshow_html = '<div class="slideshow-container">'
for url in image_urls:
    slideshow_html += f'<img src="{url}" alt="" onerror="this.style.display=\'none\'">'
slideshow_html += '</div>'

# === Render the layout ===
# Mobile-first: main content (icons, title, countdown) then weather then slideshow
# Desktop: CSS grid repositions weather to left sidebar
st.markdown(f'''
<div class="layout-wrapper">
    <div class="layout-main">
        {main_html}
        {slideshow_html}
    </div>
    <div class="layout-weather">
        {weather_html}
    </div>
</div>
''', unsafe_allow_html=True)

# Handle retry for weather errors (needs Streamlit widget outside the HTML)
if not weather_data:
    if st.button("Retry", key="retry_weather"):
        st.cache_data.clear()
        st.rerun()

# Balloons if trip has started
if countdown is None:
    st.balloons()

# Snow effect
snow_html = '''
<div class="snowflakes">
    <div class="snowflake">❄</div>
    <div class="snowflake">❅</div>
    <div class="snowflake">❆</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❅</div>
    <div class="snowflake">❆</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❅</div>
    <div class="snowflake">❆</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❅</div>
    <div class="snowflake">❆</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❅</div>
    <div class="snowflake">❆</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❅</div>
    <div class="snowflake">❆</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❅</div>
</div>
'''
st.markdown(snow_html, unsafe_allow_html=True)

# Auto-refresh every 5 seconds
time.sleep(5)
st.rerun()
