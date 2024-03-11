import React, { useEffect, useState } from 'react';
import SidePanel from '../../components/SidePanel';

const PrivateKeysFromBook = () => {
  // State to hold the input value
  const [inputValue, setInputValue] = useState('');

  // State to hold the processed output value
  const [outputValue, setOutputValue] = useState('');

  // Implement or import your 'process' function
  const process = (inputString:string) => {
    // Your processing logic here
    return inputString.toUpperCase(); // Example processing
  };

  // Handler for the input change
  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const processedValue = process(inputValue);
    setOutputValue(processedValue);
  },[inputValue])

  return (
    <div>
        <SidePanel></SidePanel>
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
            />
            <div>Output: {outputValue}</div>
        </div>
    </div>
  );
};

export default PrivateKeysFromBook;