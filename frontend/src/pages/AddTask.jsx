import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const S = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#fff',
  },
  leftPanel: {
    flex: '0 0 480px',
    maxWidth: '480px',
    width: '100%',
    padding: '40px 48px 48px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '0 32px 32px 0',
    boxShadow: '4px 0 32px rgba(0,0,0,0.06)',
    zIndex: 1,
    overflowY: 'auto',
  },
  logo: {
    height: '36px',
    width: 'auto',
    marginBottom: '32px',
    cursor: 'pointer',
  },
  heading: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 6px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#888',
    margin: '0 0 28px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '18px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  input: {
    height: '42px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0 14px',
    fontSize: '13px',
    color: '#1a1a2e',
    outline: 'none',
    transition: 'border-color .2s',
    backgroundColor: '#fff',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    height: '42px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0 14px',
    fontSize: '13px',
    color: '#1a1a2e',
    outline: 'none',
    backgroundColor: '#fff',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  inputFocus: { borderColor: '#3563e9' },
  errorMsg: { fontSize: '13px', color: '#e53e3e', margin: '0 0 12px' },
  hint: { fontSize: '11px', color: '#aaa', marginTop: '2px' },
  btn: {
    marginTop: '8px',
    height: '46px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3563e9',
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background .2s, opacity .2s',
    width: '160px',
  },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  rightPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #3563e9 0%, #2547c7 100%)',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '24px 0 0 24px',
  },
  row: { display: 'flex', gap: '14px' },
};

const ALGERIA_WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
  'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
  'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
  'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
  'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi',
  'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt',
  'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla',
  'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'Timimoun',
  'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès', 'In Salah',
  'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa',
];

const GridPattern = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    style={{ position: 'absolute', inset: 0, opacity: 0.18 }}
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect x="4"  y="4"  width="34" height="34" rx="4" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <rect x="44" y="4"  width="32" height="16" rx="4" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <rect x="44" y="26" width="32" height="12" rx="4" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <rect x="4"  y="44" width="16" height="32" rx="4" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <rect x="26" y="44" width="12" height="32" rx="4" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <rect x="44" y="44" width="32" height="32" rx="4" fill="none" stroke="#fff" strokeWidth="1.2"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)"/>
  </svg>
);

const Field = ({ label, name, value, onChange, type = 'text', placeholder, min, hint }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.formGroup}>
      <label style={S.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        style={{ ...S.input, ...(focused ? S.inputFocus : {}) }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {hint && <span style={S.hint}>{hint}</span>}
    </div>
  );
};

const SelectField = ({ label, name, value, onChange, options, hint }) => (
  <div style={S.formGroup}>
    <label style={S.label}>{label}</label>
    <select name={name} value={value} onChange={onChange} style={S.select}>
      <option value="">Select…</option>
      {options.map(({ value: v, label: l }) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
    {hint && <span style={S.hint}>{hint}</span>}
  </div>
);

// ── STEP 1: Task Details ──────────────────────────────────
const StepTask = ({ data, onChange, onNext, error }) => (
  <>
    <h1 style={S.heading}>Post a Task</h1>
    <p style={S.subtitle}>Enter your information and your task details below</p>

    <Field
      label="Task Title"
      name="title"
      value={data.title}
      onChange={onChange}
      placeholder="Enter the task title"
      hint="Minimum 10 characters"
    />

    <SelectField
      label="Category"
      name="category"
      value={data.category}
      onChange={onChange}
      options={[
        { value: 'web_development',    label: 'Web Development' },
        { value: 'mobile_development', label: 'Mobile Development' },
        { value: 'design',             label: 'Design' },
        { value: 'writing',            label: 'Writing' },
        { value: 'marketing',          label: 'Marketing' },
        { value: 'video',              label: 'Video' },
        { value: 'audio',              label: 'Audio' },
        { value: 'data',               label: 'Data' },
        { value: 'other',              label: 'Other' },
      ]}
    />

    <Field
      label="Skills Required"
      name="skills"
      value={data.skills}
      onChange={onChange}
      placeholder="e.g. react, nodejs, figma"
      hint="Comma-separated, 1–10 skills"
    />

    <Field
      label="Description"
      name="description"
      value={data.description}
      onChange={onChange}
      placeholder="Describe the task in detail"
      hint="Minimum 30 characters"
    />

    <SelectField
      label="Experience Level"
      name="experienceLevel"
      value={data.experienceLevel}
      onChange={onChange}
      options={[
        { value: 'entry',        label: 'Entry' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'expert',       label: 'Expert' },
      ]}
    />

    <SelectField
      label="Location"
      name="location"
      value={data.location}
      onChange={onChange}
      options={[
        { value: 'remote',  label: 'Remote' },
        { value: 'onsite',  label: 'On-site' },
        { value: 'hybrid',  label: 'Hybrid' },
      ]}
    />

    <SelectField
      label="Wilaya"
      name="wilaya"
      value={data.wilaya}
      onChange={onChange}
      options={ALGERIA_WILAYAS.map(w => ({ value: w, label: w }))}
      hint="Select your wilaya"
    />

    <Field
      label="City"
      name="city"
      value={data.city}
      onChange={onChange}
      placeholder="e.g. Bab Ezzouar"
      hint="Enter your city or commune"
    />

    <Field
      label="Phone Number"
      name="phone"
      value={data.phone}
      onChange={onChange}
      placeholder="e.g. +213 555 123 456"
      type="tel"
      hint="Include country code if outside Algeria"
    />

    {error && <p style={S.errorMsg}>{error}</p>}

    <button type="button" style={S.btn} onClick={onNext}>
      Next to payment
    </button>
  </>
);

// ── STEP 2: Payment / Budget ──────────────────────────────
const StepPayment = ({ data, onChange, onSubmit, loading, error }) => (
  <>
    <h1 style={S.heading}>Post a Task</h1>
    <p style={S.subtitle}>Enter your information and your task details below</p>

    <SelectField
      label="Budget Type"
      name="budgetType"
      value={data.budgetType}
      onChange={onChange}
      options={[
        { value: 'fixed',  label: 'Fixed Price' },
        { value: 'hourly', label: 'Hourly Rate' },
      ]}
    />

    <div style={S.row}>
      <div style={{ flex: 1 }}>
        <Field
          label="Min Budget ($)"
          name="budgetMin"
          value={data.budgetMin}
          onChange={onChange}
          placeholder="e.g. 100"
          type="number"
          min="1"
        />
      </div>
      <div style={{ flex: 1 }}>
        <Field
          label="Max Budget ($)"
          name="budgetMax"
          value={data.budgetMax}
          onChange={onChange}
          placeholder="e.g. 500"
          type="number"
          min="1"
        />
      </div>
    </div>

    <Field
      label="Deadline"
      name="deadline"
      value={data.deadline}
      onChange={onChange}
      type="date"
      hint="Must be a future date"
    />

    {error && <p style={S.errorMsg}>{error}</p>}

    <button
      type="button"
      style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }}
      onClick={onSubmit}
      disabled={loading}
    >
      {loading ? 'Posting…' : 'Post the task'}
    </button>
  </>
);

// ── MAIN COMPONENT ────────────────────────────────────────
const AddTask = () => {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [taskData, setTaskData] = useState({
    title:           '',
    category:        '',
    skills:          '',
    description:     '',
    experienceLevel: '',
    location:        'remote',
    wilaya:          '',
    city:            '',
    phone:           '',
    budgetType:      'fixed',
    budgetMin:       '',
    budgetMax:       '',
    deadline:        '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const { title, category, skills, description, experienceLevel, wilaya, city, phone } = taskData;
    if (!title || !category || !skills || !description || !experienceLevel || !wilaya || !city || !phone) {
      setError('Please fill in all required fields.');
      return;
    }
    if (title.length < 10) {
      setError('Title must be at least 10 characters.');
      return;
    }
    if (description.length < 30) {
      setError('Description must be at least 30 characters.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    const { budgetType, budgetMin, budgetMax, deadline } = taskData;

    if (!budgetType || !budgetMin || !budgetMax || !deadline) {
      setError('Please fill in all budget and deadline fields.');
      return;
    }
    if (Number(budgetMax) < Number(budgetMin)) {
      setError('Max budget must be greater than or equal to min budget.');
      return;
    }
    if (new Date(deadline) <= new Date()) {
      setError('Deadline must be a future date.');
      return;
    }

    setError('');
    setLoading(true);

    const skillsArray = taskData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      title:           taskData.title,
      description:     taskData.description,
      category:        taskData.category,
      skills:          skillsArray,
      experienceLevel: taskData.experienceLevel,
      location:        taskData.location,
      wilaya:          taskData.wilaya,
      city:            taskData.city,
      phone:           taskData.phone,
      budget: {
        type: taskData.budgetType,
        min:  Number(taskData.budgetMin),
        max:  Number(taskData.budgetMax),
      },
      deadline: taskData.deadline,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/works', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to post task.');
        return;
      }

      navigate('/my-tasks');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      {/* LEFT */}
      <div style={S.leftPanel}>
        <img
          src={logo}
          alt="Askili Logo"
          style={S.logo}
          onClick={() => navigate('/')}
        />

        {step === 1 ? (
          <StepTask
            data={taskData}
            onChange={handleChange}
            onNext={handleNext}
            error={error}
          />
        ) : (
          <StepPayment
            data={taskData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        )}
      </div>

      {/* RIGHT */}
      <div style={S.rightPanel}>
        <GridPattern />
      </div>
    </div>
  );
};

export default AddTask;