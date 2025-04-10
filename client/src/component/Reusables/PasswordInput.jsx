import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const PasswordInput = ({placeholder, id, name, required, className, value, onChange, onPaste}) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePassword = () => {
      setShowPassword(!showPassword)
    }

  return (
    <div className="relative">
      <input type={showPassword ? 'text' : 'password'} placeholder={placeholder} id={id} name={name} required={required} className={`${className} pr-10`} value={value} onChange={onChange} onPaste={onPaste}/>
      <button type="button" className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer" onClick={togglePassword}>
        {showPassword ? (<AiOutlineEyeInvisible size={20} />) : (<AiOutlineEye size={20} />)}
      </button>
    </div>
  )
}

export default PasswordInput