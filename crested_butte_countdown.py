import streamlit as st
from datetime import datetime
import time

# Page configuration - MUST be first Streamlit command
st.set_page_config(
    page_title="Crested Butte Trip Countdown",
    page_icon="🏔️",
    layout="centered"
)

# GitHub raw URL for images
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/weljim73-spec/crestedbutte2026countdown/main"

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
    .time-unit {
        display: inline-block;
        margin: 10px 15px;
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
        min-width: 100px;
        display: inline-block;
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

# Header
st.markdown('<div class="mountain-emoji">🏔️⛷️🎿</div>', unsafe_allow_html=True)
st.markdown('<h1 class="countdown-title">Crested Butte Trip Countdown</h1>', unsafe_allow_html=True)
st.markdown(f'<p class="countdown-subtitle">Adventure begins: March 14, 2026</p>', unsafe_allow_html=True)

# Countdown display
countdown = calculate_countdown()

if countdown is None:
    st.balloons()
    st.success("🎉 The trip has begun! Have an amazing time in Crested Butte! 🎉")
else:
    # Create columns for the countdown display
    col1, col2, col3, col4, col5 = st.columns(5)

    with col1:
        st.markdown(f"""
        <div class="time-unit">
            <div class="time-value">{countdown['weeks']}</div>
            <div class="time-label">Weeks</div>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown(f"""
        <div class="time-unit">
            <div class="time-value">{countdown['days']}</div>
            <div class="time-label">Days</div>
        </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown(f"""
        <div class="time-unit">
            <div class="time-value">{countdown['hours']:02d}</div>
            <div class="time-label">Hours</div>
        </div>
        """, unsafe_allow_html=True)

    with col4:
        st.markdown(f"""
        <div class="time-unit">
            <div class="time-value">{countdown['minutes']:02d}</div>
            <div class="time-label">Minutes</div>
        </div>
        """, unsafe_allow_html=True)

    with col5:
        st.markdown(f"""
        <div class="time-unit">
            <div class="time-value">{countdown['seconds']:02d}</div>
            <div class="time-label">Seconds</div>
        </div>
        """, unsafe_allow_html=True)

# Photo slideshow with error handling for missing images
slideshow_html = '<div class="slideshow-container">'
for url in image_urls:
    slideshow_html += f'<img src="{url}" alt="" onerror="this.style.display=\'none\'">'
slideshow_html += '</div>'

st.markdown(slideshow_html, unsafe_allow_html=True)

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

# Auto-refresh every second
time.sleep(1)
st.rerun()
