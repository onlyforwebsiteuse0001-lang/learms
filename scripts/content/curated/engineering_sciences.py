"""Curated engineering and natural-science syllabi.

Sources: Pakistan Engineering Council (PEC) accredited BE/BSc Engineering curricula for
civil, mechanical and electrical engineering; HEC revised curriculum for BS Physics.
"""

from __future__ import annotations

PEC = ("Pakistan Engineering Council — accredited engineering curricula", "https://www.pec.org.pk/", "2026-09-30")
HEC_PHYSICS = ("HEC revised curriculum — BS Physics", "https://www.hec.gov.pk/", "2026-09-30")

COURSES = [
    {
        "id": "civil_structural_analysis",
        "field": "engineering",
        "category": "civil",
        "title": "Civil Engineering — Structural Analysis",
        "title_ur": "ساختی تجزیہ",
        "description": (
            "Determining forces and deformations in structures under load, from statically "
            "determinate frames to indeterminate systems and the matrix stiffness method."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 3, 0),
        "accreditation": "PEC — BE Civil Engineering core",
        "source": PEC,
        "outcomes": [
            "Classify a structure as determinate, indeterminate or unstable.",
            "Compute reactions and internal forces in determinate structures.",
            "Draw shear force and bending moment diagrams accurately.",
            "Analyse indeterminate structures by force and displacement methods.",
        ],
        "concepts": [
            ("statics_review", "Equilibrium and free-body diagrams", "Force and moment equilibrium; drawing a free body that is actually free.", "apply", 2, 50, [], "numerical", ["equilibrium", "FBD", "reaction"]),
            ("determinacy", "Static determinacy and stability", "Counting equations and unknowns; recognising mechanisms and geometric instability.", "analyze", 3, 50, ["statics_review"], "numerical", ["determinacy", "degree of indeterminacy"]),
            ("trusses", "Analysis of trusses", "Method of joints and method of sections; identifying zero-force members.", "apply", 3, 60, ["determinacy"], "numerical", ["method of joints", "zero-force member"]),
            ("sfd_bmd", "Shear force and bending moment diagrams", "Relationships between load, shear and moment; points of contraflexure.", "apply", 3, 70, ["statics_review"], "numerical", ["shear", "bending moment", "contraflexure"]),
            ("stress_strain", "Stress, strain and material behaviour", "Hooke's law, elastic modulus, Poisson's ratio and the stress-strain curve.", "understand", 2, 55, ["statics_review"], "numerical", ["Hooke", "modulus", "yield"]),
            ("bending_stress", "Bending and shear stress in beams", "The flexure formula, section modulus and the transverse shear distribution.", "apply", 4, 60, ["sfd_bmd", "stress_strain"], "numerical", ["flexure formula", "section modulus"]),
            ("deflection", "Beam deflection", "Double integration, Macaulay's method, and moment-area.", "apply", 4, 70, ["bending_stress"], "numerical", ["deflection", "Macaulay", "moment-area"]),
            ("virtual_work", "Energy methods", "Strain energy, virtual work and Castigliano's theorems for deflection.", "analyze", 4, 60, ["deflection"], "numerical", ["virtual work", "Castigliano"]),
            ("influence_lines", "Influence lines", "Constructing influence lines and positioning moving loads for maximum effect.", "analyze", 4, 55, ["sfd_bmd"], "numerical", ["influence line", "moving load"]),
            ("force_method", "Force method for indeterminate structures", "Redundants, compatibility equations and the flexibility coefficient.", "analyze", 5, 70, ["virtual_work", "determinacy"], "numerical", ["redundant", "compatibility", "flexibility"]),
            ("slope_deflection", "Slope-deflection and moment distribution", "Displacement-based analysis of continuous beams and frames.", "analyze", 5, 75, ["force_method"], "numerical", ["slope-deflection", "moment distribution"]),
            ("matrix_stiffness", "Matrix stiffness method", "Element and global stiffness matrices; the basis of every structural analysis package.", "analyze", 5, 70, ["slope_deflection"], "numerical", ["stiffness matrix", "assembly", "DOF"]),
            ("buckling", "Columns and buckling", "Euler critical load, slenderness ratio and end-condition effective length.", "apply", 4, 50, ["stress_strain"], "numerical", ["Euler", "slenderness", "effective length"]),
        ],
    },
    {
        "id": "mechanical_thermodynamics",
        "field": "engineering",
        "category": "mechanical",
        "title": "Mechanical Engineering — Thermodynamics",
        "title_ur": "حرحرکیات",
        "description": (
            "Energy, its conversion and its irreducible losses: the laws of thermodynamics and "
            "the cycles that power engines, refrigerators and power plants."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 3, 0),
        "accreditation": "PEC — BE Mechanical Engineering core",
        "source": PEC,
        "outcomes": [
            "Apply the first law to closed and open systems.",
            "Use property tables and charts to fix a state.",
            "Apply the second law and compute entropy change.",
            "Analyse power and refrigeration cycles and compute their efficiency.",
        ],
        "concepts": [
            ("basic_concepts", "Systems, properties and state", "Closed vs open systems, intensive and extensive properties, equilibrium and process.", "understand", 1, 45, [], "mcq", ["system", "property", "state"]),
            ("energy_forms", "Forms of energy, work and heat", "Internal energy, boundary work, and heat as energy in transit driven by temperature difference.", "understand", 2, 50, ["basic_concepts"], "numerical", ["work", "heat", "internal energy"]),
            ("pure_substance", "Properties of pure substances", "Phase diagrams, saturation, quality, and reading steam tables.", "apply", 3, 65, ["basic_concepts"], "numerical", ["saturation", "quality", "steam tables"]),
            ("ideal_gas", "Ideal gas behaviour", "The ideal gas equation, specific heats, and where the ideal assumption breaks down.", "apply", 2, 50, ["pure_substance"], "numerical", ["ideal gas", "cp", "cv"]),
            ("first_law_closed", "First law: closed systems", "Energy balance for a fixed mass; polytropic processes.", "apply", 3, 65, ["energy_forms", "ideal_gas"], "numerical", ["energy balance", "polytropic"]),
            ("first_law_open", "First law: control volumes", "Steady-flow energy equation applied to nozzles, turbines, compressors and heat exchangers.", "apply", 3, 70, ["first_law_closed"], "numerical", ["SFEE", "enthalpy", "steady flow"]),
            ("second_law", "The second law", "Kelvin-Planck and Clausius statements; reversibility and the Carnot limit.", "understand", 3, 55, ["first_law_open"], "short_answer", ["Kelvin-Planck", "Clausius", "Carnot"]),
            ("entropy", "Entropy", "Clausius inequality, entropy change for solids, liquids and ideal gases; isentropic processes.", "analyze", 4, 70, ["second_law"], "numerical", ["entropy", "isentropic", "Ts diagram"]),
            ("exergy", "Exergy and irreversibility", "Availability, reversible work and quantifying where useful work was destroyed.", "analyze", 5, 55, ["entropy"], "numerical", ["exergy", "irreversibility", "dead state"]),
            ("gas_power", "Gas power cycles", "Otto, Diesel and Brayton cycles; compression ratio and thermal efficiency.", "analyze", 4, 70, ["entropy"], "numerical", ["Otto", "Diesel", "Brayton"]),
            ("vapour_power", "Vapour power cycles", "Rankine cycle, reheat and regeneration, and condenser pressure effects.", "analyze", 4, 65, ["entropy", "pure_substance"], "numerical", ["Rankine", "reheat", "regeneration"]),
            ("refrigeration", "Refrigeration and heat pumps", "Vapour-compression cycle, COP, and refrigerant selection constraints.", "apply", 4, 55, ["vapour_power"], "numerical", ["COP", "vapour-compression", "refrigerant"]),
            ("psychrometrics", "Psychrometrics", "Moist air properties, the psychrometric chart, and air-conditioning processes.", "apply", 4, 50, ["ideal_gas"], "numerical", ["humidity", "psychrometric chart", "dew point"]),
        ],
    },
    {
        "id": "electrical_circuit_analysis",
        "field": "engineering",
        "category": "electrical",
        "title": "Electrical Engineering — Circuit Analysis",
        "title_ur": "برقی سرکٹ تجزیہ",
        "description": (
            "Systematic analysis of DC and AC circuits: the laws, the systematic methods, "
            "transient response and steady-state phasor analysis."
        ),
        "level": "undergraduate",
        "credit_hours": (4, 3, 1),
        "accreditation": "PEC — BE Electrical Engineering core",
        "source": PEC,
        "outcomes": [
            "Apply Kirchhoff's laws to analyse a circuit systematically.",
            "Reduce a network using Thevenin and Norton equivalents.",
            "Determine the transient response of first- and second-order circuits.",
            "Analyse AC steady-state circuits using phasors and compute power.",
        ],
        "concepts": [
            ("circuit_elements", "Circuit variables and elements", "Charge, current, voltage, power; resistors, capacitors, inductors and sources.", "understand", 1, 45, [], "mcq", ["current", "voltage", "passive sign convention"]),
            ("ohm_kirchhoff", "Ohm's and Kirchhoff's laws", "KCL and KVL as conservation statements; series and parallel reduction.", "apply", 2, 55, ["circuit_elements"], "numerical", ["KCL", "KVL", "equivalent resistance"]),
            ("divider", "Voltage and current division", "Dividers, and loading effects that make the ideal formula wrong.", "apply", 2, 40, ["ohm_kirchhoff"], "numerical", ["divider", "loading"]),
            ("nodal_mesh", "Nodal and mesh analysis", "Choosing the method with fewer equations; supernodes and supermeshes.", "apply", 3, 70, ["ohm_kirchhoff"], "numerical", ["nodal", "mesh", "supernode"]),
            ("superposition", "Superposition and source transformation", "Linearity, and when superposition does not apply to power.", "apply", 3, 50, ["nodal_mesh"], "numerical", ["superposition", "source transformation"]),
            ("thevenin_norton", "Thevenin and Norton equivalents", "Equivalent networks and maximum power transfer.", "analyze", 3, 60, ["superposition"], "numerical", ["Thevenin", "Norton", "max power transfer"]),
            ("opamp", "Operational amplifiers", "Ideal op-amp assumptions; inverting, non-inverting and summing configurations.", "apply", 3, 55, ["thevenin_norton"], "practical", ["op-amp", "virtual short", "gain"]),
            ("capacitor_inductor", "Capacitors and inductors", "Energy storage, i-v relationships and series/parallel combination.", "understand", 2, 45, ["circuit_elements"], "numerical", ["capacitance", "inductance", "energy"]),
            ("first_order", "First-order transients", "RC and RL natural and step response; time constant and the 5τ rule.", "analyze", 4, 65, ["capacitor_inductor", "thevenin_norton"], "numerical", ["time constant", "step response"]),
            ("second_order", "Second-order transients", "RLC response; damping ratio and the overdamped/critical/underdamped cases.", "analyze", 5, 65, ["first_order"], "numerical", ["damping", "RLC", "natural frequency"]),
            ("phasors", "Sinusoids and phasors", "Representing sinusoidal steady state as complex amplitudes; impedance and admittance.", "apply", 3, 60, ["capacitor_inductor"], "numerical", ["phasor", "impedance", "reactance"]),
            ("ac_power", "AC power analysis", "Instantaneous, average, apparent and reactive power; power factor correction.", "analyze", 4, 65, ["phasors"], "numerical", ["power factor", "reactive power", "VA"]),
            ("three_phase", "Three-phase circuits", "Balanced star and delta systems, line versus phase quantities, and three-phase power.", "apply", 4, 60, ["ac_power"], "numerical", ["star", "delta", "line voltage"]),
            ("frequency_response", "Frequency response and resonance", "Transfer functions, Bode plots, series/parallel resonance and Q factor.", "analyze", 5, 60, ["phasors"], "numerical", ["Bode", "resonance", "Q factor"]),
        ],
    },
    {
        "id": "physics_mechanics",
        "field": "natural_sciences",
        "category": "physics",
        "title": "Physics — Classical Mechanics",
        "title_ur": "کلاسیکی میکانیات",
        "description": (
            "Motion and the forces that cause it, built up from kinematics to the conservation "
            "laws and rotational dynamics."
        ),
        "level": "undergraduate",
        "credit_hours": (4, 3, 1),
        "accreditation": "HEC — BS Physics core",
        "source": HEC_PHYSICS,
        "outcomes": [
            "Resolve vectors and apply them to motion in two dimensions.",
            "Apply Newton's laws to multi-body systems with friction.",
            "Solve problems using conservation of energy and momentum.",
            "Analyse rotational motion using torque and angular momentum.",
        ],
        "concepts": [
            ("units_vectors", "Units, dimensions and vectors", "SI units, dimensional analysis as an error check, vector components and products.", "apply", 1, 50, [], "numerical", ["dimensional analysis", "dot product", "cross product"]),
            ("kinematics_1d", "Kinematics in one dimension", "Displacement, velocity, acceleration and the equations of uniformly accelerated motion.", "apply", 2, 50, ["units_vectors"], "numerical", ["velocity", "acceleration", "SUVAT"]),
            ("kinematics_2d", "Motion in two dimensions", "Projectile motion and uniform circular motion.", "apply", 2, 55, ["kinematics_1d"], "numerical", ["projectile", "centripetal", "range"]),
            ("newton_laws", "Newton's laws of motion", "Inertia, F = ma, action-reaction, and free-body diagrams for connected bodies.", "apply", 3, 65, ["kinematics_2d"], "numerical", ["free body", "net force", "tension"]),
            ("friction", "Friction and drag", "Static versus kinetic friction, the coefficient of friction, and motion on an incline.", "apply", 3, 50, ["newton_laws"], "numerical", ["friction", "normal force", "incline"]),
            ("work_energy", "Work and kinetic energy", "Work by constant and variable forces, and the work-energy theorem.", "apply", 3, 55, ["newton_laws"], "numerical", ["work", "kinetic energy", "power"]),
            ("potential_energy", "Potential energy and conservation", "Conservative forces, potential energy functions and mechanical energy conservation.", "analyze", 3, 55, ["work_energy"], "numerical", ["conservative force", "mechanical energy"]),
            ("momentum", "Linear momentum and impulse", "Impulse-momentum theorem and conservation of momentum in isolated systems.", "apply", 3, 55, ["work_energy"], "numerical", ["impulse", "momentum conservation"]),
            ("collisions", "Collisions", "Elastic and inelastic collisions in one and two dimensions; the coefficient of restitution.", "analyze", 4, 60, ["momentum", "potential_energy"], "numerical", ["elastic", "inelastic", "restitution"]),
            ("com", "Centre of mass", "Locating the centre of mass and the motion of a system of particles.", "apply", 3, 45, ["momentum"], "numerical", ["centre of mass", "system of particles"]),
            ("rotational_kinematics", "Rotational kinematics", "Angular displacement, velocity and acceleration; rolling without slipping.", "apply", 3, 50, ["kinematics_2d"], "numerical", ["angular velocity", "rolling"]),
            ("torque_inertia", "Torque and moment of inertia", "Rotational analogue of Newton's second law; the parallel axis theorem.", "analyze", 4, 65, ["rotational_kinematics", "newton_laws"], "numerical", ["torque", "moment of inertia", "parallel axis"]),
            ("angular_momentum", "Angular momentum", "Conservation of angular momentum and gyroscopic behaviour.", "analyze", 4, 55, ["torque_inertia"], "numerical", ["angular momentum", "conservation"]),
            ("shm", "Simple harmonic motion", "Restoring force, period, energy in SHM, the pendulum, and damping.", "analyze", 4, 60, ["potential_energy"], "numerical", ["SHM", "period", "damping"]),
            ("gravitation", "Gravitation", "Newton's law of gravitation, orbital motion and Kepler's laws.", "apply", 4, 55, ["angular_momentum"], "numerical", ["gravitation", "orbit", "Kepler"]),
        ],
    },
]
