"""
FiberLab: Numerical Aperture of an Optical Fiber
Virtual Physics Laboratory for Engineering Students
Streamlit Application
"""

import io
import math
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import streamlit as st
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

# Page Configuration
st.set_page_config(
    page_title="FiberLab: Numerical Aperture of an Optical Fiber",
    page_icon="O",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Flat Academic CSS (Strict: No gradients, small corner radius, flat colors, no emojis)
st.markdown("""
<style>
    /* Base typography and colors */
    html, body, [class*="css"] {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        color: #0f172a;
    }
    
    /* Buttons */
    .stButton > button {
        border-radius: 4px !important;
        border: 1px solid #cbd5e1 !important;
        background-color: #0369a1 !important;
        color: #ffffff !important;
        font-weight: 500 !important;
        padding: 6px 14px !important;
        transition: background-color 150ms ease !important;
    }
    .stButton > button:hover {
        background-color: #0284c7 !important;
        border-color: #0284c7 !important;
    }
    
    /* Download Button */
    .stDownloadButton > button {
        border-radius: 4px !important;
        border: 1px solid #cbd5e1 !important;
        background-color: #ffffff !important;
        color: #0f172a !important;
        font-weight: 500 !important;
    }
    .stDownloadButton > button:hover {
        background-color: #f1f5f9 !important;
        border-color: #94a3b8 !important;
    }

    /* Cards and metric boxes */
    div[data-testid="stMetricValue"] {
        font-family: 'JetBrains Mono', monospace !important;
        color: #0369a1 !important;
        font-weight: 700 !important;
    }
    
    /* Tab headers */
    .stTabs [data-baseweb="tab-list"] {
        gap: 4px;
        border-bottom: 1px solid #cbd5e1;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 4px 4px 0 0 !important;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 500;
        color: #475569;
        background-color: transparent;
    }
    .stTabs [aria-selected="true"] {
        color: #0369a1 !important;
        font-weight: 600 !important;
        border-bottom: 2px solid #0369a1 !important;
    }

    /* Info and Alert boxes */
    .lab-box {
        background-color: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 16px;
        margin-bottom: 16px;
    }
    .lab-box-laser {
        background-color: #fef2f2;
        border: 1px solid #fca5a5;
        border-radius: 4px;
        padding: 14px;
        margin-bottom: 14px;
    }
</style>
""", unsafe_allow_html=True)


# Physics Calculation Helpers
def calculate_reading(L: float, D: float):
    """Calculates NA and acceptance angle for a single reading."""
    if L <= 0 or D <= 0:
        return None
    half_d = D / 2.0
    hypotenuse = math.sqrt(L * L + half_d * half_d)
    na = half_d / hypotenuse
    na_clamped = min(max(na, 0.0), 1.0)
    theta_rad = math.asin(na_clamped)
    theta_deg = math.degrees(theta_rad)
    return {
        "half_d": round(half_d, 3),
        "hypotenuse": round(hypotenuse, 4),
        "na": round(na, 3),
        "theta": round(theta_deg, 2),
        "raw_na": na,
        "raw_theta": theta_deg
    }


def generate_pdf_report(student_name, roll_no, df_readings, avg_na, acceptance_angle, acceptance_cone, theo_na, pct_error):
    """Generates an academic A4 laboratory report PDF."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#0369a1'),
        alignment=1
    )
    subtitle_style = ParagraphStyle(
        'SubTitleStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#0f172a'),
        alignment=1
    )
    section_head = ParagraphStyle(
        'SectionHead',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=10,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    
    elements = []
    
    # Header
    elements.append(Paragraph("FiberLab: Physics Laboratory Report", title_style))
    elements.append(Paragraph("Determination of Numerical Aperture and Acceptance Angle of an Optical Fiber", subtitle_style))
    elements.append(Spacer(1, 10))
    
    # Metadata Box
    meta_text = f"<b>Student Name:</b> {student_name or 'Not specified'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Roll Number:</b> {roll_no or 'Not specified'}<br/><b>Course:</b> Engineering Physics Laboratory (Optics)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Wavelength:</b> 650 nm (Diode Laser)"
    elements.append(Paragraph(meta_text, body_style))
    elements.append(Spacer(1, 8))
    
    # Aim
    elements.append(Paragraph("1. AIM", section_head))
    elements.append(Paragraph("To determine the numerical aperture (NA) and acceptance angle of a given step-index optical fiber using a 650 nm diode laser source and projection screen.", body_style))
    elements.append(Spacer(1, 8))
    
    # Formulas
    elements.append(Paragraph("2. FORMULAS", section_head))
    elements.append(Paragraph("Numerical Aperture (NA) = (D / 2) / sqrt(L^2 + (D / 2)^2)<br/>Acceptance Angle (theta_0) = arcsin(NA) degrees<br/>Acceptance Cone Angle = 2 * theta_0 degrees", body_style))
    elements.append(Spacer(1, 8))
    
    # Observation Table
    elements.append(Paragraph("3. OBSERVATION TABLE", section_head))
    
    table_data = [["S.No", "L (cm)", "D (cm)", "D/2 (cm)", "sqrt(L^2+(D/2)^2)", "NA", "theta (deg)"]]
    for idx, row in df_readings.iterrows():
        table_data.append([
            str(int(row["S.No"])),
            f"{row['L (cm)']:.2f}",
            f"{row['D (cm)']:.2f}",
            f"{row['D/2 (cm)']:.3f}",
            f"{row['sqrt(L^2+(D/2)^2)']:.4f}",
            f"{row['NA']:.3f}",
            f"{row['theta (deg)']:.2f}"
        ])
        
    t = Table(table_data, colWidths=[36, 68, 68, 68, 96, 60, 72])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0369a1')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('FONTNAME', (0, 1), (-1, -1), 'Courier'),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 10))
    
    # Results
    elements.append(Paragraph("4. RESULTS AND CONCLUSION", section_head))
    res_text = f"The average numerical aperture of the given optical fiber is <b>{avg_na:.3f}</b> and its acceptance angle is <b>{acceptance_angle:.2f}</b> degrees.<br/>Full acceptance cone divergence: <b>{acceptance_cone:.2f}</b> degrees."
    if theo_na is not None:
        res_text += f"<br/>Theoretical NA: <b>{theo_na:.3f}</b> | Percentage Error: <b>{pct_error:.2f}%</b>"
    elements.append(Paragraph(res_text, body_style))
    elements.append(Spacer(1, 8))
    
    # Precautions
    elements.append(Paragraph("5. KEY PRECAUTIONS", section_head))
    precautions_text = "1. Never look directly into the laser beam or fiber output end while powered.<br/>2. Keep the optical fiber straight without sharp bends or kinks.<br/>3. Clean polished connector tips with lens tissue before connecting.<br/>4. Ensure the fiber end is aligned perpendicular to the projection screen.<br/>5. Dim the ambient room lighting to identify the illuminated boundary clearly."
    elements.append(Paragraph(precautions_text, body_style))
    elements.append(Spacer(1, 16))
    
    elements.append(Paragraph("Generated by FiberLab Virtual Physics Laboratory: Academic Educational System", ParagraphStyle('FooterStyle', parent=styles['Normal'], fontName='Helvetica', fontSize=8, textColor=colors.HexColor('#94a3b8'), alignment=1)))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()


# Main Application Interface
st.title("FiberLab: Numerical Aperture of an Optical Fiber")
st.markdown("**Aim:** To determine the numerical aperture and acceptance angle of a given optical fiber.")

# Tabbed Navigation
tab_experiment, tab_apparatus, tab_theory, tab_procedure, tab_precautions, tab_applications, tab_quiz, tab_legal = st.tabs([
    "Experiment & Results",
    "Apparatus (3D)",
    "Theory & Ray Diagram",
    "Procedure (9 Steps)",
    "Precautions",
    "Applications",
    "Quiz",
    "Legal & Credits"
])

# ----------------------------------------------------
# TAB 1: EXPERIMENT & RESULTS
# ----------------------------------------------------
with tab_experiment:
    st.subheader("Observation Table and Data Entry")
    st.markdown("Record distance $L$ (cm) between fiber tip and screen, and spot diameter $D$ (cm). All derived columns are automatically calculated.")

    # Control Buttons
    col_btn1, col_btn2, col_btn3 = st.columns([2, 2, 4])
    
    # State management for observations
    if "observation_data" not in st.session_state:
        st.session_state.observation_data = pd.DataFrame({
            "S.No": [1, 2, 3, 4, 5],
            "L (cm)": [2.0, 3.0, 4.0, 5.0, 6.0],
            "D (cm)": [1.6, 2.4, 3.2, 4.0, 4.8]
        })

    with col_btn1:
        if st.button("Load example data (Example data)"):
            st.session_state.observation_data = pd.DataFrame({
                "S.No": [1, 2, 3, 4, 5],
                "L (cm)": [2.0, 3.0, 4.0, 5.0, 6.0],
                "D (cm)": [1.6, 2.4, 3.2, 4.0, 4.8]
            })
            st.rerun()

    with col_btn2:
        if st.button("Clear Table"):
            st.session_state.observation_data = pd.DataFrame({
                "S.No": [1, 2, 3, 4, 5],
                "L (cm)": [2.0, 3.0, 4.0, 5.0, 6.0],
                "D (cm)": [0.0, 0.0, 0.0, 0.0, 0.0]
            })
            st.rerun()

    # Editable Dataframe
    edited_df = st.data_editor(
        st.session_state.observation_data,
        num_rows="dynamic",
        use_container_width=True,
        column_config={
            "S.No": st.column_config.NumberColumn("S.No", disabled=True),
            "L (cm)": st.column_config.NumberColumn("L (cm)", min_value=0.1, max_value=50.0, step=0.1, required=True),
            "D (cm)": st.column_config.NumberColumn("D (cm)", min_value=0.0, max_value=50.0, step=0.1, required=True)
        }
    )
    st.session_state.observation_data = edited_df

    # Calculate Derived Columns
    calculated_rows = []
    valid_na_values = []
    valid_theta_values = []

    for idx, row in edited_df.iterrows():
        l_val = float(row.get("L (cm)", 0))
        d_val = float(row.get("D (cm)", 0))
        res = calculate_reading(l_val, d_val)
        if res:
            calculated_rows.append({
                "S.No": idx + 1,
                "L (cm)": l_val,
                "D (cm)": d_val,
                "D/2 (cm)": res["half_d"],
                "sqrt(L^2+(D/2)^2)": res["hypotenuse"],
                "NA": res["na"],
                "theta (deg)": res["theta"]
            })
            valid_na_values.append(res["raw_na"])
            valid_theta_values.append(res["raw_theta"])
        else:
            calculated_rows.append({
                "S.No": idx + 1,
                "L (cm)": l_val,
                "D (cm)": d_val,
                "D/2 (cm)": d_val / 2.0 if d_val > 0 else 0.0,
                "sqrt(L^2+(D/2)^2)": 0.0,
                "NA": 0.0,
                "theta (deg)": 0.0
            })

    full_results_df = pd.DataFrame(calculated_rows)

    st.markdown("**Complete Calculated Observation Table:**")
    st.dataframe(full_results_df, use_container_width=True)

    # Compute Averages
    if valid_na_values:
        avg_na = float(np.mean(valid_na_values))
        avg_theta = float(np.mean(valid_theta_values))
        acceptance_cone = 2.0 * avg_theta
    else:
        avg_na = 0.0
        avg_theta = 0.0
        acceptance_cone = 0.0

    st.divider()

    # Results Section
    st.subheader("Experimental Results and Conclusion")
    m_col1, m_col2, m_col3 = st.columns(3)
    with m_col1:
        st.metric("Average Numerical Aperture (NA)", f"{avg_na:.3f}")
    with m_col2:
        st.metric("Acceptance Semi-Angle (theta_0)", f"{avg_theta:.2f} deg")
    with m_col3:
        st.metric("Full Acceptance Cone (2 * theta_0)", f"{acceptance_cone:.2f} deg")

    # Conclusion statement
    st.markdown(f"""
    <div class="lab-box">
        <b>Formal Conclusion Statement:</b><br/>
        The average numerical aperture of the given optical fiber is <b>{avg_na:.3f}</b> and its acceptance angle is <b>{avg_theta:.2f}</b> degrees.
    </div>
    """, unsafe_allow_html=True)

    # Theoretical comparison & percentage error
    col_theo1, col_theo2 = st.columns(2)
    with col_theo1:
        theo_na_input = st.number_input("Theoretical NA (e.g. sqrt(n1^2 - n2^2)):", value=0.384, min_value=0.01, max_value=1.0, step=0.001)
    with col_theo2:
        if theo_na_input > 0 and avg_na > 0:
            pct_err = (abs(avg_na - theo_na_input) / theo_na_input) * 100.0
            st.metric("Percentage Error", f"{pct_err:.2f}%")
        else:
            pct_err = None
            st.metric("Percentage Error", "N/A")

    st.divider()

    # Graph and Dynamic 3D Cone Simulation Grid
    col_graph, col_sim = st.columns(2)

    with col_graph:
        st.subheader("Graph: Spot Diameter D versus Distance L")
        valid_points = full_results_df[(full_results_df["L (cm)"] > 0) & (full_results_df["D (cm)"] > 0)]
        if len(valid_points) >= 2:
            fig_graph = go.Figure()
            # Scatter points
            fig_graph.add_trace(go.Scatter(
                x=valid_points["L (cm)"],
                y=valid_points["D (cm)"],
                mode='markers',
                marker=dict(size=8, color='#dc2626'),
                name='Observed Data Points'
            ))
            # Linear trendline
            slope, intercept = np.polyfit(valid_points["L (cm)"], valid_points["D (cm)"], 1)
            x_line = np.linspace(valid_points["L (cm)"].min(), valid_points["L (cm)"].max(), 50)
            y_line = slope * x_line + intercept
            fig_graph.add_trace(go.Scatter(
                x=x_line,
                y=y_line,
                mode='lines',
                line=dict(color='#0369a1', width=2),
                name=f'Fit: D = {slope:.2f}L + {intercept:.2f}'
            ))
            fig_graph.update_layout(
                xaxis_title="Distance L (cm)",
                yaxis_title="Spot Diameter D (cm)",
                paper_bgcolor='#ffffff',
                plot_bgcolor='#f8fafc',
                margin=dict(l=40, r=20, t=20, b=40),
                height=340
            )
            st.plotly_chart(fig_graph, use_container_width=True)
        else:
            st.info("Enter at least two readings with positive L and D to display the graph.")

    with col_sim:
        st.subheader("Dynamic 3D Light Cone Simulation")
        sim_l = st.slider("Distance L (cm):", min_value=1.0, max_value=10.0, value=4.0, step=0.1)
        sim_d = st.slider("Spot Diameter D (cm):", min_value=0.8, max_value=8.0, value=3.2, step=0.1)
        
        sim_res = calculate_reading(sim_l, sim_d)
        if sim_res:
            st.caption(f"Calculated NA: {sim_res['na']:.3f} | Theta: {sim_res['theta']:.2f} deg")

        # 3D Light cone in Plotly
        u = np.linspace(0, 1, 30)
        v = np.linspace(0, 2 * np.pi, 30)
        U, V = np.meshgrid(u, v)
        # Cone from (0,0,0) to x = sim_l with radius r = sim_d / 2
        X_cone = U * sim_l
        R_cone = U * (sim_d / 2.0)
        Y_cone = R_cone * np.cos(V)
        Z_cone = R_cone * np.sin(V)

        fig_cone = go.Figure(data=[
            go.Surface(
                x=X_cone, y=Y_cone, z=Z_cone,
                colorscale=[[0, 'rgba(220,38,38,0.2)'], [1, 'rgba(220,38,38,0.8)']],
                showscale=False,
                opacity=0.6
            ),
            # Target Screen circle at x = sim_l
            go.Scatter3d(
                x=[sim_l] * 50,
                y=(sim_d / 2.0) * np.cos(np.linspace(0, 2 * np.pi, 50)),
                z=(sim_d / 2.0) * np.sin(np.linspace(0, 2 * np.pi, 50)),
                mode='lines',
                line=dict(color='#0f172a', width=4),
                name='Spot Boundary'
            )
        ])
        fig_cone.update_layout(
            scene=dict(
                xaxis_title='L (cm)',
                yaxis_title='Y (cm)',
                zaxis_title='Z (cm)',
                aspectmode='data'
            ),
            margin=dict(l=0, r=0, t=0, b=0),
            height=340
        )
        st.plotly_chart(fig_cone, use_container_width=True)

    st.divider()

    # Student Credentials & Lab Report Download
    st.subheader("Student Credentials and Lab Report Export")
    col_rep1, col_rep2 = st.columns(2)
    with col_rep1:
        st_name = st.text_input("Student Name:", value="", placeholder="Enter full name")
        st_roll = st.text_input("Roll Number:", value="", placeholder="Enter roll number")

    with col_rep2:
        st.markdown("<br/>", unsafe_allow_html=True)
        pdf_bytes = generate_pdf_report(
            st_name, st_roll, full_results_df, avg_na, avg_theta, acceptance_cone, theo_na_input, pct_err or 0.0
        )
        st.download_button(
            label="Download Lab Report (PDF)",
            data=pdf_bytes,
            file_name=f"FiberLab_Report_{st_roll or 'Student'}.pdf",
            mime="application/pdf"
        )
        csv_bytes = full_results_df.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="Export Observation Table (CSV)",
            data=csv_bytes,
            file_name=f"FiberLab_Observations_{st_roll or 'Student'}.csv",
            mime="text/csv"
        )


# ----------------------------------------------------
# TAB 2: APPARATUS (3D)
# ----------------------------------------------------
with tab_apparatus:
    st.subheader("Experimental Apparatus: Interactive 3D Setup")
    st.markdown("Inspect the assembled optical bench arrangement or examine individual optical components.")

    view_mode = st.radio("Apparatus Alignment View:", ["Assembled Bench View", "Exploded Component View"], horizontal=True)

    # 3D Visualizer of the Complete Bench Setup using Plotly
    bench_len = 10.0
    laser_x = 1.0
    clamp_x = 4.0
    screen_x = 8.0 if view_mode == "Assembled Bench View" else 9.5
    cone_rad = 1.6

    fig_bench = go.Figure()

    # 1. Optical Bench Rails (Dual cylindrical rods)
    x_rail = np.linspace(0, bench_len, 50)
    fig_bench.add_trace(go.Scatter3d(
        x=x_rail, y=[-0.6] * 50, z=[-0.5] * 50,
        mode='lines', line=dict(color='#64748b', width=8), name='Bench Rail Left'
    ))
    fig_bench.add_trace(go.Scatter3d(
        x=x_rail, y=[0.6] * 50, z=[-0.5] * 50,
        mode='lines', line=dict(color='#64748b', width=8), name='Bench Rail Right'
    ))

    # 2. Laser Source Diode Box
    fig_bench.add_trace(go.Scatter3d(
        x=[laser_x - 0.5, laser_x + 0.5, laser_x + 0.5, laser_x - 0.5, laser_x - 0.5],
        y=[-0.5, -0.5, 0.5, 0.5, -0.5],
        z=[0.5, 0.5, 0.5, 0.5, 0.5],
        mode='lines', line=dict(color='#0f172a', width=6), name='Laser Diode (650 nm)'
    ))

    # 3. Fiber Patch Cord (Coupling curve from Laser to V-Clamp)
    x_fiber = np.linspace(laser_x + 0.5, clamp_x - 0.2, 50)
    y_fiber = 0.4 * np.sin(np.linspace(0, np.pi, 50))
    z_fiber = 0.5 + 0.3 * np.sin(np.linspace(0, np.pi, 50))
    fig_bench.add_trace(go.Scatter3d(
        x=x_fiber, y=y_fiber, z=z_fiber,
        mode='lines', line=dict(color='#f59e0b', width=5), name='Multimode Optical Fiber'
    ))

    # 4. Fiber Holder with V-Clamp
    fig_bench.add_trace(go.Scatter3d(
        x=[clamp_x, clamp_x], y=[0, 0], z=[-0.5, 0.8],
        mode='lines', line=dict(color='#475569', width=10), name='Fiber Holder (V-Clamp)'
    ))

    # 5. Emitted Laser Light Cone from Fiber Tip to Screen
    u_c = np.linspace(0, 1, 20)
    v_c = np.linspace(0, 2 * np.pi, 20)
    Uc, Vc = np.meshgrid(u_c, v_c)
    dist_c = screen_x - clamp_x
    Xc = clamp_x + Uc * dist_c
    Yc = Uc * cone_rad * np.cos(Vc)
    Zc = 0.5 + Uc * cone_rad * np.sin(Vc)

    fig_bench.add_trace(go.Surface(
        x=Xc, y=Yc, z=Zc,
        colorscale=[[0, 'rgba(220,38,38,0.2)'], [1, 'rgba(220,38,38,0.7)']],
        showscale=False, opacity=0.5, name='Emitted Light Cone'
    ))

    # 6. Target Screen with Concentric Rings
    screen_rings = [0.4, 0.8, 1.2, 1.6]
    for r in screen_rings:
        th_r = np.linspace(0, 2 * np.pi, 40)
        fig_bench.add_trace(go.Scatter3d(
            x=[screen_x] * 40,
            y=r * np.cos(th_r),
            z=0.5 + r * np.sin(th_r),
            mode='lines', line=dict(color='#94a3b8' if r < cone_rad else '#dc2626', width=2),
            showlegend=False
        ))

    fig_bench.update_layout(
        scene=dict(
            xaxis_title='Optical Bench Axis (cm)',
            yaxis_title='Horizontal (cm)',
            zaxis_title='Vertical (cm)',
            aspectmode='data'
        ),
        margin=dict(l=0, r=0, t=0, b=0),
        height=450
    )
    st.plotly_chart(fig_bench, use_container_width=True)

    # Apparatus Component Specifications
    st.markdown("### Component Specifications and Functions")
    c_app1, c_app2, c_app3 = st.columns(3)
    with c_app1:
        st.markdown("""
        <div class="lab-box">
            <b>1. Laser Diode Source (650 nm)</b><br/>
            Provides monochromatic coherent red light.<br/>
            - Output wavelength: 650 nm (red)<br/>
            - Power output: 2 to 3 mW<br/>
            - Port: SMA/ST optical connector<br/>
            - Classification: Class 2 diode
        </div>
        """, unsafe_allow_html=True)
    with c_app2:
        st.markdown("""
        <div class="lab-box">
            <b>2. Multimode Optical Fiber</b><br/>
            Guides light via total internal reflection.<br/>
            - Core diameter: 50 / 62.5 um<br/>
            - Cladding diameter: 125 um<br/>
            - Cable length: 1 meter patch cord<br/>
            - NA rating: 0.22 to 0.37
        </div>
        """, unsafe_allow_html=True)
    with c_app3:
        st.markdown("""
        <div class="lab-box">
            <b>3. Fiber Holder with V-Clamp</b><br/>
            Secures fiber output tip perpendicular to screen.<br/>
            - Precision V-groove clamp<br/>
            - Upright vertical post with collar<br/>
            - Knurled thumbscrew tightening<br/>
            - Post height: 8 cm
        </div>
        """, unsafe_allow_html=True)

    c_app4, c_app5, c_app6 = st.columns(3)
    with c_app4:
        st.markdown("""
        <div class="lab-box">
            <b>4. Screen with Concentric Rings</b><br/>
            Calibrated target to measure spot diameter D.<br/>
            - Concentric rings at 2 mm intervals<br/>
            - Matte white non-reflective plate<br/>
            - Center cross-hair alignment<br/>
            - Dimensions: 15 cm x 15 cm
        </div>
        """, unsafe_allow_html=True)
    with c_app5:
        st.markdown("""
        <div class="lab-box">
            <b>5. Optical Bench with Riders</b><br/>
            Rigid coaxial linear mounting rail.<br/>
            - Twin extruded aluminum rails<br/>
            - Three sliding locking riders<br/>
            - Rail length: 100 cm<br/>
            - Leveling screws at ends
        </div>
        """, unsafe_allow_html=True)
    with c_app6:
        st.markdown("""
        <div class="lab-box">
            <b>6. Precision Meter Scale</b><br/>
            Measures axial distance L to the screen.<br/>
            - Stainless steel with etched mm divisions<br/>
            - Direct reading along bench rider<br/>
            - Anti-glare satin finish<br/>
            - Graduation: 1 mm
        </div>
        """, unsafe_allow_html=True)


# ----------------------------------------------------
# TAB 3: THEORY & RAY DIAGRAM
# ----------------------------------------------------
with tab_theory:
    st.subheader("Theory and Working Principle")
    st.markdown("""
    An optical fiber is a cylindrical dielectric waveguide consisting of a central core of refractive index $n_1$ 
    surrounded by a cladding of slightly lower refractive index $n_2$ ($n_1 > n_2$). Light entering the core undergoes 
    consecutive total internal reflections (TIR) at the core-cladding boundary and propagates with low attenuation.
    """)

    st.markdown("### Fundamental Physics Formulas")
    st.latex(r"\text{Critical Angle Condition: } \sin(\theta_c) = \frac{n_2}{n_1} \implies \theta_c = \arcsin\left(\frac{n_2}{n_1}\right)")
    st.latex(r"\text{Theoretical Numerical Aperture: } \text{NA} = \sin(\theta_0) = \sqrt{n_1^2 - n_2^2}")
    st.latex(r"\text{Experimental Laboratory Formula: } \text{NA} = \frac{D/2}{\sqrt{L^2 + (D/2)^2}} = \sin(\theta_0)")
    st.latex(r"\text{Acceptance Angle: } \theta_0 = \arcsin(\text{NA}) \quad \text{and} \quad \text{Acceptance Cone} = 2 \times \theta_0")

    st.divider()

    st.subheader("Interactive Ray Diagram: Guided Rays vs Cladding Leakage")
    st.markdown("Adjust the incident angle $\\theta_{in}$ below to observe total internal reflection inside the fiber core.")

    n1 = 1.50
    n2 = 1.45
    theo_na_val = math.sqrt(n1**2 - n2**2)
    acc_angle_deg = math.degrees(math.asin(theo_na_val))
    crit_angle_deg = math.degrees(math.asin(n2 / n1))

    slider_angle = st.slider("Incident Angle theta_in (degrees):", min_value=0.0, max_value=40.0, value=15.0, step=0.5)

    is_guided = slider_angle <= acc_angle_deg
    theta_r_rad = math.asin(math.sin(math.radians(slider_angle)) / n1)
    phi_deg = 90.0 - math.degrees(theta_r_rad)

    if is_guided:
        st.success(f"Status: Guided by Total Internal Reflection (Incident angle {slider_angle:.1f} deg <= Acceptance angle {acc_angle_deg:.1f} deg. Interface angle phi = {phi_deg:.1f} deg >= Critical angle {crit_angle_deg:.1f} deg).")
    else:
        st.error(f"Status: Lost to Cladding Attenuation (Incident angle {slider_angle:.1f} deg > Acceptance angle {acc_angle_deg:.1f} deg. Interface angle phi = {phi_deg:.1f} deg < Critical angle {crit_angle_deg:.1f} deg).")

    # Plotly 2D Ray Path
    fig_ray = go.Figure()
    # Cladding upper and lower
    fig_ray.add_shape(type="rect", x0=10, y0=2, x1=50, y1=4, fillcolor="#e2e8f0", line=dict(color="#cbd5e1"))
    fig_ray.add_shape(type="rect", x0=10, y0=-4, x1=50, y1=-2, fillcolor="#e2e8f0", line=dict(color="#cbd5e1"))
    # Core
    fig_ray.add_shape(type="rect", x0=10, y0=-2, x1=50, y1=2, fillcolor="#f8fafc", line=dict(color="#0369a1"))
    # Entrance interface
    fig_ray.add_shape(type="line", x0=10, y0=-4, x1=10, y1=4, line=dict(color="#0f172a", width=2))
    # Optical axis
    fig_ray.add_shape(type="line", x0=0, y0=0, x1=55, y1=0, line=dict(color="#94a3b8", dash="dash"))

    # Ray trajectory
    x_in = 0
    y_in = -10.0 * math.tan(math.radians(slider_angle))
    fig_ray.add_trace(go.Scatter(x=[x_in, 10], y=[y_in, 0], mode='lines', line=dict(color='#dc2626', width=3), name='Incident Ray'))

    # Inside core ray
    tan_r = math.tan(theta_r_rad)
    hit1_x = 10 + (2.0 / tan_r) if tan_r > 0.001 else 50
    if hit1_x <= 50:
        fig_ray.add_trace(go.Scatter(x=[10, hit1_x], y=[0, 2], mode='lines', line=dict(color='#dc2626', width=3), name='Core Ray'))
        if is_guided:
            hit2_x = hit1_x + (4.0 / tan_r)
            if hit2_x <= 50:
                fig_ray.add_trace(go.Scatter(x=[hit1_x, hit2_x], y=[2, -2], mode='lines', line=dict(color='#dc2626', width=3), showlegend=False))
                fig_ray.add_trace(go.Scatter(x=[hit2_x, min(hit2_x + 2.0 / tan_r, 50)], y=[-2, 0], mode='lines', line=dict(color='#dc2626', width=3), showlegend=False))
            else:
                fig_ray.add_trace(go.Scatter(x=[hit1_x, 50], y=[2, 2 - (50 - hit1_x) * tan_r], mode='lines', line=dict(color='#dc2626', width=3), showlegend=False))
        else:
            # Refracted into cladding
            fig_ray.add_trace(go.Scatter(x=[hit1_x, hit1_x + 8], y=[2, 3.6], mode='lines', line=dict(color='#94a3b8', width=2, dash='dot'), name='Lost Ray (Refracted)'))
    else:
        fig_ray.add_trace(go.Scatter(x=[10, 50], y=[0, (40) * tan_r], mode='lines', line=dict(color='#dc2626', width=3), name='Axial Ray'))

    fig_ray.update_layout(
        xaxis=dict(range=[0, 55], title="Axial Dimension (mm)"),
        yaxis=dict(range=[-5, 5], title="Radial Height (mm)"),
        margin=dict(l=20, r=20, t=20, b=20),
        height=320,
        plot_bgcolor="#ffffff"
    )
    st.plotly_chart(fig_ray, use_container_width=True)


# ----------------------------------------------------
# TAB 4: PROCEDURE (9 STEPS)
# ----------------------------------------------------
with tab_procedure:
    st.subheader("Laboratory Procedure (9 Numbered Steps)")
    st.markdown("Execute the experiment sequentially following the standard laboratory steps below.")

    steps_list = [
        ("Step 1: Arrange Apparatus on Bench", "Arrange laser, fiber holder, and screen in a straight line on the bench. Ensure riders sit squarely on the rails."),
        ("Step 2: Clean and Connect Fiber", "Clean both fiber connector ends with optical tissue: connect one end to the laser output. Never touch polished tips with fingers."),
        ("Step 3: Clamp Free End in Holder", "Fix the free end in the holder, facing the screen, perpendicular to it. Tighten the knurled V-clamp thumbscrew gently."),
        ("Step 4: Switch On Laser", "Switch on the laser: a circular spot appears on the screen. Align the rider height so the beam hits the center cross-hair."),
        ("Step 5: Set Initial Distance L", "Set the first distance L between fiber end and screen (e.g. L = 2.0 cm) using the millimeter graduated bench scale."),
        ("Step 6: Measure Spot Diameter D", "Measure the spot diameter D (horizontal and vertical, take the mean) using the concentric circle graduations."),
        ("Step 7: Repeat for Equal Increments", "Increase L in equal steps (such as 3.0, 4.0, 5.0, and 6.0 cm) and measure D at each position."),
        ("Step 8: Calculate NA for Every Reading", "Calculate NA for every reading using NA = (D/2) / sqrt(L^2 + (D/2)^2), then take the arithmetic mean."),
        ("Step 9: Calculate Acceptance Angle", "Calculate the acceptance angle from the average NA using theta_0 = arcsin(average NA) and acceptance cone 2 * theta_0.")
    ]

    for title, desc in steps_list:
        st.markdown(f"""
        <div class="lab-box">
            <b>{title}</b><br/>
            {desc}
        </div>
        """, unsafe_allow_html=True)


# ----------------------------------------------------
# TAB 5: PRECAUTIONS
# ----------------------------------------------------
with tab_precautions:
    st.subheader("Laboratory Safety Precautions (8 Rules)")
    st.markdown("Adhere strictly to personal optical safety and equipment care guidelines.")

    col_p1, col_p2 = st.columns(2)
    with col_p1:
        st.markdown("""
        <div class="lab-box-laser">
            <b>1. Laser Radiation Safety (Critical)</b><br/>
            Never look directly into the laser beam or into the fiber output end while the laser source is switched on.
        </div>
        <div class="lab-box">
            <b>2. Avoid Sharp Bends</b><br/>
            Keep the optical fiber straight with no sharp bends or kinks that induce severe macrobending losses or core fracture.
        </div>
        <div class="lab-box">
            <b>3. Clean Polished Connector Tips</b><br/>
            Clean fiber connector tips with lint-free optical lens tissue. Avoid touching the polished glass face with fingers.
        </div>
        <div class="lab-box">
            <b>4. Perpendicular Alignment</b><br/>
            Ensure the output tip of the fiber is mounted strictly perpendicular to the flat surface of the projection screen.
        </div>
        """, unsafe_allow_html=True)

    with col_p2:
        st.markdown("""
        <div class="lab-box">
            <b>5. Dim Ambient Room Lighting</b><br/>
            Dim the room lights so the outer boundary of the illuminated red laser spot is clearly distinguishable on the target.
        </div>
        <div class="lab-box">
            <b>6. Consistent Boundary Criteria</b><br/>
            Measure spot diameter D consistently from the same perimeter intensity threshold across all distance readings.
        </div>
        <div class="lab-box">
            <b>7. Gentle Cable Handling</b><br/>
            Handle the optical patch cable gently without pulling or twisting the strain-relief boots at the connectors.
        </div>
        <div class="lab-box-laser">
            <b>8. Switch Off Between Readings (Diode Care)</b><br/>
            Switch off the laser source between reading sets to prevent semiconductor diode junction overheating.
        </div>
        """, unsafe_allow_html=True)


# ----------------------------------------------------
# TAB 6: APPLICATIONS
# ----------------------------------------------------
with tab_applications:
    st.subheader("Engineering Applications of Optical Fibers")
    st.markdown("""
    <div class="lab-box">
        <b>Engineering Rationale: Why Numerical Aperture Matters:</b><br/>
        The numerical aperture dictates the light-gathering capacity and coupling efficiency of the fiber to optical sources. 
        A larger numerical aperture accepts more incident light from wide-angle emitters, making physical connector alignment easier. 
        However, higher numerical aperture values increase modal dispersion in multimode fibers because higher-order modes traverse 
        longer zig-zag paths, reducing signal transmission bandwidth over long telecommunication distances.
    </div>
    """, unsafe_allow_html=True)

    apps = [
        ("1. Optical Fiber Communication and Internet Backbone", "High capacity undersea and terrestrial glass fiber cables transmit digital voice, video, and data across continents with minimal optical attenuation.", "A controlled numerical aperture balances light gathering efficiency with low modal dispersion to sustain multi-gigabit data transmission rates."),
        ("2. Medical Endoscopy and Arthroscopy", "Flexible coherent fiber bundles deliver high intensity illumination and return high resolution optical images from internal body cavities during surgeries.", "A high numerical aperture collects diffuse reflected light from internal tissue, providing brighter clinical imagery inside tight cavities."),
        ("3. Fiber Optic Sensors in Civil Infrastructure", "Optical fibers embedded inside bridges, dams, and tunnels monitor structural strain, temperature variations, and acoustic events in real time.", "Specific numerical aperture values ensure stable light coupling into Fiber Bragg Gratings and interferometric sensing zones."),
        ("4. Defense and Aerospace Communication", "Fly-by-light flight control links and naval communication buses utilize fiber optics because glass conductors are immune to electromagnetic interference (EMI).", "Tightly controlled numerical aperture fibers maintain coupling stability under intense mechanical vibration and thermal extremes."),
        ("5. Illumination and Architectural Lighting", "Optical fibers guide bright light from remote illuminators to display cabinets and architectural landmarks without carrying heat or electrical current.", "A wide acceptance angle enables high optical coupling efficiency from broad halogen or solid-state LED light engines."),
        ("6. Industrial Inspection and Factory Networks", "Optical fibers carry sensor telemetry and video feeds through harsh industrial manufacturing cells containing heavy electromagnetic motors.", "Optimized numerical aperture values permit forgiving connector alignment in dusty, vibrating industrial environments.")
    ]

    for title, desc, na_role in apps:
        st.markdown(f"""
        <div class="lab-box">
            <b>{title}</b><br/>
            {desc}<br/>
            <small style="color:#0369a1;"><b>Role of NA:</b> {na_role}</small>
        </div>
        """, unsafe_allow_html=True)


# ----------------------------------------------------
# TAB 7: QUIZ
# ----------------------------------------------------
with tab_quiz:
    st.subheader("Knowledge Assessment Quiz (5 Multiple-Choice Questions)")
    st.markdown("Test your understanding of numerical aperture, total internal reflection, and acceptance angle.")

    quiz_questions = [
        {
            "q": "1. What is the physical meaning of the Numerical Aperture of an optical fiber?",
            "options": [
                "The physical diameter of the outer protective jacket",
                "The dimensionless figure of merit measuring the light gathering capacity of the fiber",
                "The attenuation rate of light per kilometer of fiber",
                "The electrical conductivity of the glass core"
            ],
            "correct": 1,
            "explanation": "Numerical Aperture (NA) is a dimensionless parameter that characterizes the range of angles over which the fiber can accept and propagate light by total internal reflection."
        },
        {
            "q": "2. What condition is required for Total Internal Reflection to occur inside an optical fiber?",
            "options": [
                "Light must travel from core to cladding, and core refractive index must be greater than cladding refractive index (n1 > n2)",
                "The refractive index of the cladding must be greater than the core refractive index (n2 > n1)",
                "The incident angle inside the core must be smaller than the critical angle",
                "The fiber must be coated with a metallic reflective silver film"
            ],
            "correct": 0,
            "explanation": "Total internal reflection requires light to travel in an optically denser medium (core, n1) toward an optically rarer medium (cladding, n2, where n1 > n2) with an angle of incidence greater than the critical angle."
        },
        {
            "q": "3. If core index n1 = 1.50 and cladding index n2 = 1.45, what is theoretical NA in air?",
            "options": [
                "NA = 0.384",
                "NA = 0.520",
                "NA = 0.200",
                "NA = 0.707"
            ],
            "correct": 0,
            "explanation": "NA = sqrt(n1^2 - n2^2) = sqrt(1.50^2 - 1.45^2) = sqrt(2.25 - 2.1025) = sqrt(0.1475) = 0.384."
        },
        {
            "q": "4. How is the acceptance angle theta_0 related to the Numerical Aperture (NA) in air?",
            "options": [
                "theta_0 = arccos(NA)",
                "theta_0 = arcsin(NA)",
                "theta_0 = arctan(NA)",
                "theta_0 = 1 / NA"
            ],
            "correct": 1,
            "explanation": "For light entering from air (n0 = 1.0), the acceptance angle theta_0 is defined by sin(theta_0) = NA, which gives theta_0 = arcsin(NA)."
        },
        {
            "q": "5. In this experiment, how is spot diameter D related to distance L from fiber tip to screen?",
            "options": [
                "Spot diameter D decreases linearly as distance L increases",
                "Spot diameter D remains completely constant regardless of distance L",
                "Spot diameter D increases linearly with distance L as light diverges in a cone",
                "Spot diameter D oscillates sinusoidally with distance L"
            ],
            "correct": 2,
            "explanation": "Light exits the fiber end face in a conical beam of half-angle theta_0. As distance L increases, spot diameter D increases proportionally according to D = 2 * L * tan(theta_0)."
        }
    ]

    user_answers = {}
    for idx, item in enumerate(quiz_questions):
        st.markdown(f"**{item['q']}**")
        user_answers[idx] = st.radio(
            "Select answer:",
            item["options"],
            key=f"quiz_opt_{idx}",
            label_visibility="collapsed"
        )
        st.write("")

    if st.button("Submit Quiz"):
        score = 0
        st.markdown("### Quiz Results")
        for idx, item in enumerate(quiz_questions):
            ans = user_answers[idx]
            correct_ans = item["options"][item["correct"]]
            if ans == correct_ans:
                score += 1
                st.success(f"{item['q']}<br/>Correct: {ans}<br/><small>{item['explanation']}</small>")
            else:
                st.error(f"{item['q']}<br/>Your answer: {ans} | Correct answer: {correct_ans}<br/><small>{item['explanation']}</small>")
        st.metric("Total Score", f"{score} / {len(quiz_questions)} ({int((score / len(quiz_questions)) * 100)}%)")


# ----------------------------------------------------
# TAB 8: LEGAL & CREDITS
# ----------------------------------------------------
with tab_legal:
    st.subheader("Legal and Resource Attribution")
    
    st.markdown("""
    <div class="lab-box">
        <b>Privacy Policy:</b><br/>
        FiberLab does not store permanent student records without explicit user consent. 
        Zero advertising trackers, cookies, or commercial analytics scripts are used. 
        All calculations execute locally in session state.
    </div>
    
    <div class="lab-box">
        <b>Terms and Conditions:</b><br/>
        This software is provided for academic and non-commercial educational instruction. 
        Calculations adhere to standard Snell's law formulations on an as-is basis with no warranty on physical equipment fabrication tolerances.
    </div>
    
    <div class="lab-box">
        <b>Image and Diagram Credits:</b><br/>
        All diagrams and 3D schematics are licensed under Creative Commons Attribution 4.0 or Educational Open Access.<br/>
        Reference citations: Wikimedia Commons (Hustvedt, B. Wellum, G. Schierholz, David Monniaux, Fir0002) and NASA Technical Reports.
    </div>
    """, unsafe_allow_html=True)

# Footer
st.markdown("""
<div style="text-align: center; font-size: 11px; color: #94a3b8; padding-top: 24px; border-top: 1px solid #cbd5e1; margin-top: 36px;">
    FiberLab: Numerical Aperture of an Optical Fiber | Academic Virtual Physics Laboratory System
</div>
""", unsafe_allow_html=True)
