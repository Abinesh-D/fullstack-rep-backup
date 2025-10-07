const { translate } = require("google-translate-api-x");

function extractNames(text) {
  return text.match(/[A-Z]\.\s?[A-Za-z]+/g) || [];
}

async function translateToEnglish(text) {
  const cleanedText = text.trim();
  const names = extractNames(cleanedText);
  const nameStr = names.join(" ");

  try {
    const textWithoutNames = cleanedText.replace(nameStr, "");

    const response = await translate(textWithoutNames, {
      from: "auto",
      to: "en",
    });

    return `${nameStr} ${response.text}`.trim();
  } catch (err) {
    console.error("Translation failed:", err.message || err);
    return cleanedText;
  }
}

module.exports = translateToEnglish;







// // import translate "google-translate-api-x"; 4
// const {translate} = require("google-translate-api-x")

// function extractNames(text) {
//   return text.match(/[A-Z]\.\s?[A-Za-z]+/g) || [];
// }

// async function translateToEnglish(text) {
//   const cleanedText = text.trim();
//   const names = extractNames(cleanedText);
//   const nameStr = names.join(" ");

//   try {
//     const textWithoutNames = cleanedText.replace(nameStr, "");

//     const response = await translate(textWithoutNames, {
//       from: "auto", 
//       to: "en",
//     });

//     return `${nameStr} ${response.text}`.trim();
//   } catch (err) {
//     console.error("Translation failed:", err.message || err);
//     return cleanedText;
//   }
// }

// export default translateToEnglish;













// const { translate } = require('@vitalets/google-translate-api');

// function extractNames(text) {
//   return text.match(/[A-Z]\.\s?[A-Za-z]+/g) || [];
// }

// async function translateToEnglish(text) {
//   console.log('translateToEnglish', text);
//   const cleanedText = text.trim();
//   const names = extractNames(cleanedText);
//   const nameStr = names.join(' ');

//   try {
//     const textWithoutNames = cleanedText.replace(nameStr, '');

//     const response = await translate(textWithoutNames, {
//       from: 'auto',
//       to: 'en',
//     });

//     return `${nameStr} ${response.text}`.trim();
//   } catch (err) {
//     console.error('Translation failed:', err.message || err);
//     return cleanedText;
//   }
// }

// module.exports = translateToEnglish;











// const googleTranslate = require('google-translate-api-x');

// function extractNames(text) {
//   return text.match(/[A-Z]\.\s?[A-Za-z]+/g) || [];
// }

// async function translateToEnglish(text) {
//   const cleanedText = text.trim();
//   const names = extractNames(cleanedText);
//   const nameStr = names.join(' ');

//   try {
//     const textWithoutNames = cleanedText.replace(nameStr, '');

//     const response = await googleTranslate(textWithoutNames, {
//       from: 'auto',
//       to: 'en',
//     });

//     return `${nameStr} ${response.text}`.trim();
//   } catch (err) {
//     console.error('Translation failed:', err.message || err);
//     return cleanedText;
//   }
// }

// module.exports = translateToEnglish;








// const googleTranslate = require('google-translate-api-x');

// async function translateToEnglish(text) {
//   const cleanedText = text.trim();
//   try {
//     const response = await googleTranslate(cleanedText, {
//       from: 'auto',
//       to: 'en'
//     });
//     return response.text;
//   } catch (err) {
//     console.error('Translation failed:', err.message || err);
//     return cleanedText;
//   }
// }

// module.exports = translateToEnglish;










// const googleTranslate = require('google-translate-api-x');

// async function translateToEnglish(text) {
//   try {
//     const response = await googleTranslate(text, { to: 'en' });
//     return response.text;
//   } catch (err) {
//     console.error('Translation failed:', err);
//     return text;
//   }
// }

// module.exports = translateToEnglish;
