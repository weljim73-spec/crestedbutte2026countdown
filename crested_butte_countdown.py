import streamlit as st
from datetime import datetime
import time

# Page configuration - MUST be first Streamlit command
st.set_page_config(
    page_title="Crested Butte Trip Countdown",
    page_icon="🏔️",
    layout="centered"
)

# Open Graph meta tags for link previews
st.markdown("""
<meta property="og:title" content="Crested Butte Trip Countdown" />
<meta property="og:description" content="Counting down to our ski adventure in Crested Butte, Colorado - March 14, 2026!" />
<meta property="og:image" content="https://raw.githubusercontent.com/weljim73-spec/crestedbutte2026countdown/main/preview.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Crested Butte Trip Countdown" />
<meta name="twitter:description" content="Counting down to our ski adventure in Crested Butte, Colorado!" />
<meta name="twitter:image" content="https://raw.githubusercontent.com/weljim73-spec/crestedbutte2026countdown/main/preview.png" />
""", unsafe_allow_html=True)

# Custom CSS for styling
st.markdown("""
<style>
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

# Auto-refresh every second
time.sleep(1)
st.rerun()
