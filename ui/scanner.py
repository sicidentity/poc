import streamlit as st
import cv2
import numpy as np
from pyzbar.pyzbar import decode
import requests
from streamlit_lottie import st_lottie
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the page
st.set_page_config(
    page_title="Student ID Scanner",
    page_icon="🎥",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Custom CSS for mobile-like interface
st.markdown("""
    <style>
    .stApp {
        max-width: 460px !important;
        margin: 0 auto;
    }
    
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
    
    .main .block-container {
        padding: 2rem 1rem;
    }
    
    [data-testid="stImage"] {
        display: flex;
        justify-content: center;
        background: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 1rem 0;
    }
    
    h1, h2, h3 {
        text-align: center;
        color: #333;
    }
    
    .student-info {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 1rem 0;
    }
    
    .verification-animation {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 2rem 0;
    }
    </style>
""", unsafe_allow_html=True)

# API endpoint
API_URL = os.getenv('API_URL', 'http://localhost:3000')

def load_lottie_url(url: str):
    try:
        r = requests.get(url)
        if r.status_code != 200:
            return None
        return r.json()
    except:
        return None

# Load verification animation
verification_animation = load_lottie_url("https://assets5.lottiefiles.com/packages/lf20_jbrw3hcz.json")
error_animation = load_lottie_url("https://assets5.lottiefiles.com/packages/lf20_q8ND3g.json")

def display_student_info(student_data):
    st.markdown("""
        <div class="student-info">
            <h2>Student Information</h2>
            <p><strong>Name:</strong> {}</p>
            <p><strong>Student Number:</strong> {}</p>
            <p><strong>Program:</strong> {}</p>
            <p><strong>Year of Study:</strong> {}</p>
            <p><strong>Email:</strong> {}</p>
        </div>
    """.format(
        student_data.get('fullName', 'N/A'),
        student_data.get('studentNumber', 'N/A'),
        student_data.get('program', 'N/A'),
        student_data.get('yearOfStudy', 'N/A'),
        student_data.get('email', 'N/A')
    ), unsafe_allow_html=True)

def main():
    st.title("Student ID Scanner")
    
    # Initialize session state
    if 'verification_state' not in st.session_state:
        st.session_state.verification_state = None
    if 'student_data' not in st.session_state:
        st.session_state.student_data = None

    # Camera input with USB camera (index 1 usually represents external/USB camera)
    camera = st.camera_input("Scan QR Code", key="usb_camera")

    if camera is not None:
        # Convert the image to numpy array
        bytes_data = camera.getvalue()
        cv2_img = cv2.imdecode(np.frombuffer(bytes_data, np.uint8), cv2.IMREAD_COLOR)
        
        # Decode QR code
        decoded_objects = decode(cv2_img)
        
        if decoded_objects:
            qr_data = decoded_objects[0].data.decode('utf-8')
            
            try:
                # Validate QR code with backend
                response = requests.post(f"{API_URL}/api/qr/validate", json={
                    "encryptedPayload": qr_data
                })
                
                if response.status_code == 200:
                    st.session_state.verification_state = "success"
                    st.session_state.student_data = response.json()
                else:
                    st.session_state.verification_state = "error"
                    st.error("Invalid or expired QR code")
            except requests.exceptions.RequestException as e:
                st.session_state.verification_state = "error"
                st.error(f"Error connecting to server: {str(e)}")

    # Display verification animation and student info
    if st.session_state.verification_state == "success":
        with st.container():
            st_lottie(verification_animation, key="verification", height=200)
            if st.session_state.student_data:
                display_student_info(st.session_state.student_data)
    elif st.session_state.verification_state == "error":
        st_lottie(error_animation, key="error", height=200)

    # Reset button
    if st.session_state.verification_state is not None:
        if st.button("Scan Another"):
            st.session_state.verification_state = None
            st.session_state.student_data = None
            st.experimental_rerun()

if __name__ == "__main__":
    main()
