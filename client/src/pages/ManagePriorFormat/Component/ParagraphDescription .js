import React, { useState, useRef, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import axios from 'axios';

const ParagraphDescription = ({ paragraphData, filteredDescriptions, setFilteredDescriptions, patentId }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    autoResizeTextarea();
  }, [inputValue]);

 

  const handleChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    const numbers = value
      .split(',')
      .map(num => num.trim())
      .filter(num => num.length > 0);

    const result = {};
    numbers.forEach(num => {
      result[num] = paragraphData[num] || 'Not found';
    });

    // for (const num of numbers) {
    //   try {
    //     const response = await axios.get(`http://localhost:8080/description/data/${patentId}/${num}`);
    //     result[num] = response.data.content?.join('\n') || 'Not found';
    //   } catch (err) {
    //     result[num] = 'Not found';
    //     console.error(`Error fetching paragraph [${num}]:`, err.message);
    //   }
    // }

    setFilteredDescriptions(result);
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div>
      <Row>
        <Col xs="12" md="4">
          <textarea
            ref={textareaRef}
            placeholder="Enter numbers like 0001,0033"
            value={inputValue}
            onChange={handleChange}
            onInput={autoResizeTextarea}
            style={{
              padding: '10px',
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'none',
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}
          />
        </Col>

        <Col xs="12" md="8">
          {Object.entries(filteredDescriptions).map(([key, value]) => (
            <div
              key={key}
              style={{
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#f1f5f9',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>[{key}]</p>
              <p style={{ margin: '6px 0 0 0', color: '#334155', whiteSpace: 'pre-wrap' }}>{value}</p>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default ParagraphDescription;
