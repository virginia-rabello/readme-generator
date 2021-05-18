const badge1 = 'https://img.shields.io/badge/language-';
const badge2 = 'https://img.shields.io/badge/license-';
const licenseLink = 'https://opensource.org/licenses/';
const date = new Date();
const year = date.getFullYear();
// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
function renderLicenseBadge(license) {
  let license2 = license.licenseChoice.replaceAll('-','--');
 let badge = '![]('+badge2+license2+'-blue)';
 return badge;
}

// TODO: Create a function that returns the license link
// If there is no license, return an empty string
function renderLicenseLink(license) {
  let link = licenseLink + license.licenseChoice;
  return link;   
}

// TODO: Create a function that returns the license section of README
// If there is no license, return an empty string
function renderLicenseSection(license) {
  if(license.license){
  return`# License
  ${renderLicenseBadge(license)}

  Copyright (c) ${year} ${license.owner}.
  Licensed under the [${license.licenseChoice}](${renderLicenseLink(license)}) license.
  `} else {return '';}
}

function generateContent(content, title){
  if(!content){
    return '';
  }else{
    return`${title}
    
  ${content}
`
  }
}

function generateScreenshots (content){
  let images = '';
  if(content.screenshots[0].confirmScreenshot){
    content.screenshots.forEach(element => {
      if(element.confirmScreenshot){
      images += `![](assets/images/${element.screenshot})
`;  }
    });
    return images;
  }else {return '';}
}

function generateTpaList(data){
let tpas = '';
if(data.tpa[0].confirmTpa){
  data.tpa.forEach(element => {
    tpas += `### ${element.name}
* Creators
`; 
  element.creators.forEach(element => {
    tpas += `  * [${element.name}](${element.link})
`;
  
});
  });
return`## Third Part Asset(s)
  
${tpas}
`
}else {return '';}

}

function generateColaboratorsList(data){
  let colaborators = '';
  if(data.colaborators[0].confirmColaborators){
  data.colaborators.forEach(element => {
    if(element.confirmColaborators){
    colaborators += `* [${element.colaborator}](${element.colaboratorGithub})`;
   }
  });
  return`## Colaborator(s)
  
${colaborators}
`
}else {return '';}
}

function generateTutorialList(data){
  let tutorials = '';
  if(data.tutorials[0].tutorials){
  data.tutorials.forEach(element => {
    if(element.tutorials){
    tutorials += `* [${element.link}](${element.link})
`; }
  });
  return`## Tutorial(s)
  
${tutorials}
`
}else {return '';}
}

function generateCredits(data){
  if(data.tpa[0].confirmTpa || data.tutorials[0].tutorials || data.colaborators[0].confirmColaborators){
  return`# Credits

${generateColaboratorsList(data)}
${generateTpaList(data)}
${generateTutorialList(data)}`
  }else{return '';} 
}

function generateLanguageBadges (data){
  let badges = '';
  data.languageBadges.forEach(element => {
    badges = badges + '![]('+badge1+element+'-green) ';
  });
  return badges;
}

function generateTableOfContents(content){
    let credits = false;
  if (content.credits.colaborators[0].confirmColaborators || content.credits.tpa[0].confirmTpa || content.credits.tutorials[0].tutorials){
    credits = true;
  }
  if(!content.confirmTable){
    return '';
  }
  else if(content.confirmInstallation && !credits && !content.license[0].license) { 
  return`# Table of Contents  

  * [Installation](#installation)
  * [Usage](#usage)
   
  `
  }
 
  else if(content.confirmInstallation && credits && !content.license[0].license) { 
    return`# Table of Contents  

  * [Installation](#installation)
  * [Usage](#usage)
  * [Credits](#credits)
   
  `
    }
    else if(content.confirmInstallation && !credits && content.license[0].license) { 
      return`# Table of Contents  
  
  * [Installation](#installation)
  * [Usage](#usage)
  * [License](#license)
   
  `
      }
  else if(content.confirmInstallation && credits && content.license[0].license) { 
    return`# Table of Contents  

  * [Installation](#installation)
  * [Usage](#usage)
  * [Credits](#credits)
  * [License](#license)
   
  `
    }
 else if (!content.confirmInstallation && credits && content.license[0].license){
  return`# Table of Contents  

  * [Usage](#usage)
  * [Credits](#credits)
  * [License](#license)
   
  `
    }
  else if (!content.confirmInstallation && !credits && content.license[0].license) {
    return`# Table of Contents  

  * [Usage](#usage)
  * [License](#license)
     
  `
  } 
  else if (!content.confirmInstallation && !credits && !content.license[0].license){
    return`# Table of Contents  
    
  * [Usage](#usage)
    
  `
  }
  else if(!content.confirmInstallation && credits && !content.license[0].license){
    return`# Table of Contents  

  * [Usage](#usage)
  * [Credits](#credits)
    
  `
  }
 }


// TODO: Create a function to generate markdown for README
function generateMarkdown(data) {
  return `# ${data.name}
  ${generateLanguageBadges(data)}

# Description

${data.description}

${generateTableOfContents(data)}
${generateContent(data.installation, '# Installation')}
${generateContent(data.usage, '# Usage')}
${generateScreenshots(data)}
${generateCredits(data.credits)}
${renderLicenseSection(data.license[0])}
`

}

module.exports = generateMarkdown;
