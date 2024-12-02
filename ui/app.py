import streamlit as st
import requests
from PIL import Image
import io
import base64
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Configure the page
st.set_page_config(
    page_title="Student ID System",
    page_icon="🎓",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Custom CSS to make it look like a mobile app
st.markdown("""
    <style>
    /* Center the content and limit width for mobile-like experience */
    .stApp {
        max-width: 460px !important;
        margin: 0 auto;
    }
    
    /* Style buttons to look more like mobile buttons */
    .stButton > button {
        width: 100%;
        border-radius: 20px;
        height: 3rem;
        background-color: #4CAF50;
        color: white;
        font-weight: bold;
        margin: 10px 0;
        border: none;
    }
    
    /* Style text inputs */
    .stTextInput > div > div > input {
        border-radius: 20px;
        height: 3rem;
        padding-left: 20px;
    }
    
    /* Style select boxes */
    .stSelectbox > div > div {
        border-radius: 20px;
        height: 3rem;
    }
    
    /* Add some padding around the main content */
    .main .block-container {
        padding: 2rem 1rem;
    }
    
    /* Style the QR code container */
    [data-testid="stImage"] {
        display: flex;
        justify-content: center;
        background: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 1rem 0;
    }
    
    /* Style headers */
    h1, h2, h3 {
        text-align: center;
        color: #333;
    }
    
    /* Add spacing between elements */
    .element-container {
        margin-bottom: 1rem;
    }
    </style>
""", unsafe_allow_html=True)

# API endpoint
API_URL = os.getenv('API_URL', 'http://localhost:3000')

def display_qr_code(qr_image_data):
    # Remove the data URL prefix if present
    if qr_image_data.startswith('data:image/png;base64,'):
        qr_image_data = qr_image_data.split(',')[1]
    
    # Convert base64 to bytes
    qr_bytes = base64.b64decode(qr_image_data)
    
    # Create PIL Image
    qr_image = Image.open(io.BytesIO(qr_bytes))
    
    return qr_image

def main():
    st.title("🎓 Student Digital ID")
    
    # Using a hardcoded ID for testing (replace with your actual user ID)
    user_id = "03b9b62c-1419-47dc-baba-3d08ec8cdff4"
    
    try:
        # Fetch user details from API
        response = requests.get(f"{API_URL}/api/users/{user_id}")
        if response.status_code == 200:
            user_data = response.json()
            
            # Display user information
            st.subheader("Student Information")
            col1, col2 = st.columns(2)
            
            with col1:
                st.write("**Full Name:**", user_data.get('fullName'))
                st.write("**Email:**", user_data.get('email'))
                st.write("**Date of Birth:**", user_data.get('dateOfBirth')[:10])
                st.write("**Student Number:**", user_data.get('studentNumber'))
            
            with col2:
                st.write("**Program:**", user_data.get('program'))
                st.write("**Year of Study:**", user_data.get('yearOfStudy'))
                if user_data.get('nin'):
                    st.write("**NIN Number:**", user_data.get('nin').get('ninNumber'))
            
            # QR Code generation button
            if st.button("Generate QR Code"):
                # Call the QR generation endpoint
                qr_response = requests.get(f"{API_URL}/api/qr/generate/{user_id}")
                if qr_response.status_code == 200:
                    qr_data = qr_response.json()
                    qr_image = display_qr_code(qr_data['qrImage'])
                    st.image(qr_image, caption="Your Digital ID QR Code", width=300)
                    st.warning("⚠️ This QR code is time-sensitive and will expire soon!")
                    st.info(f"QR Code generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                else:
                    st.error("Failed to generate QR code. Please try again.")
        else:
            st.error("User not found. Please check the user ID.")
            
    except requests.exceptions.RequestException as e:
        st.error(f"Error connecting to the server. Please ensure the backend server is running.")
            
if __name__ == "__main__":
    main()
