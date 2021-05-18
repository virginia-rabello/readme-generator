const fs = require('fs');
const util = require('util');
const inquirer = require('inquirer');
const generateMarkdown = require('./utils/generateMarkdown');

function creator(name, link, confirm) {
    this.name = name,
    this.link = link,
    this.confirmAnother = confirm
}

function tpa(name,confirm) {
    this.name = name,
    this.confirmTpa = confirm,
    this.creators = [],
    this.adding = function(creator){
        this.creators.push(creator);
    }
}
// TODO: Create an array of questions for user input
//const questions = [];

const questions = () => {
    console.log(`
    <<<<<<<<<<<<<<<<<<<<<<<<<<<<
           README CREATOR 
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    `);
    return inquirer.prompt([
        {
         type: 'input',
         name: 'name',
         message: 'What is the name of your project? (Required)',
         validate: nameInput =>{
             if (nameInput){
                 return true;
             }else{
                 console.log('You need to enter a project name!');
                 return false;
             }
         }   
        },
        {
         type: 'input',
         name: 'description',
         message: 'Provide a description of the project (Required)',
         validate: descriptionInput => {
             if (descriptionInput){
                 return true;
             }else{
                 console.log('You need to enter a project description!');
                 return false;
             }
         }   
        },
        {
            type: 'checkbox',
            name: 'languageBadges',
            message: 'Which languages does your project have?',
            choices: ['HTML', 'Javascript', 'CSS', 'Node', 'Java'],
        },
        {
            type: 'confirm',
            name: 'confirmTable',
            message: 'Would you like to add a table of contents?',
            default: false
        },
        {
            type: 'confirm',
            name: 'confirmInstallation',
            message: 'Does your project need installation?',
            default: false       
        },
        {
            type: 'input',
            name: 'installation',
            message: 'Provide installation instructions. (Required)',
            validate: installationInput => {
                if(installationInput){
                    return true;
                }else{
                    console.log('You have to provide the installation instructions.');
                    return false;
                }
            },
            when: ({confirmInstallation}) => confirmInstallation
        },
        {
            type: 'input',
            name: 'usage',
            message: 'Explain how to use your app. (Required)',
            validate: usageInput => {
                if (usageInput){
                    return true;
                }else{
                    console.log('You need to enter a explanation for usage!');
                    return false;
                }
            }   
        }
        
    ]);
};

const screenshots = readmeData => {
    if(!readmeData.screenshots){
        readmeData.screenshots = [];
    }
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmScreenshot',
            message: 'Would you like to add a screenshot?',
            default: 'false'
        },
        {
            type: 'input',
            name: 'screenshot',
            message: 'Paste here the name of your screenshot file.',
            validate: screenshotInput => {
                if(screenshotInput){
                    return true;
                }else{
                    console.log('You have to enter your screenshot file');
                    return false;
                }
            },
            when: ({confirmScreenshot}) => confirmScreenshot
        }
    ])
    .then (screenshot => {
       // console.log('Do not forget to copy your screenshot in the directory "images" inside of the directory "assets".');
        readmeData.screenshots.push(screenshot);
        if(screenshot.confirmScreenshot){
            return screenshots(readmeData);
        }else{
            return readmeData;
        }

    });
};

const colaborators = readmeData => {
    if(!readmeData.credits) {
        readmeData.credits = {};
        readmeData.credits.colaborators = [];
    }
    return inquirer.prompt([
    {
        type: 'confirm',
        name: 'confirmColaborators',
        message: 'Would you like to add another colaborator?',
        default: false
    },
    {
        type: 'input',
        name: 'colaborator',
        message: 'Enter the name of your colaborator.',
        validate: colaboratorInput => {
            if(colaboratorInput){
                return true;
            }else{
                console.log('You have to enter the name of your colaborator');
                return false;
            }
        },
        when: ({confirmColaborators}) => confirmColaborators
    },
    {
        type: 'input',
        name: 'colaboratorGithub',
        message: 'Enter the colaborator Github URL.',
        validate: colaboratorInput => {
            if(colaboratorInput){
                return true;
            }else{
                console.log('You have to enter the URL.');
                return false;
            }
        },
        when: ({confirmColaborators}) => confirmColaborators
    }
         
    
    ])

    .then (colaboratorData => {
        readmeData.credits.colaborators.push(colaboratorData);
        if(colaboratorData.confirmColaborators){
            return colaborators(readmeData);
        }else{
            return readmeData;
        }

    });
};

const thirdPartAssets = (readmeData, currentTpa) => {
    if(!readmeData.credits.tpa) {
        readmeData.credits.tpa = [];
        }
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmTpa',
            message: 'Do you want to add a third-part asset?',
            default: false
        },
        {
            type: 'input',
            name: 'tpa',
            message: 'Enter the name of the third-part asset.',
            validate: tpaInput => {
                if(tpaInput){
                     return true;
                }else{
                    console.log('You have to enter the name of the third-part asset.');
                    return false;
                }
            },
            when: ({confirmTpa}) => confirmTpa
        },
        {
            type: 'confirm',
            name: 'tpaCreator',
            message: 'Would you like to add a creator for this asset.',
            default: false,
            when: ({confirmTpa}) => confirmTpa
           
        }
     ]) 
    .then (tpaData => {
        let newTpa = new tpa (tpaData.tpa,tpaData.confirmTpa);
        if(!currentTpa){
        readmeData.credits.tpa.push(newTpa);  
        } 
        if(currentTpa){
        readmeData.credits.tpa.push(currentTpa); 
        }   
        if(tpaData.confirmTpa){
                  
            if(tpaData.tpaCreator && tpaData.confirmTpa){
               return thirdPartCreators(readmeData, newTpa);
            }else{
            return thirdPartAssets(readmeData, currentTpa);
            }
        }
       
        else{
            return readmeData;
        }
    });
};

const thirdPartCreators = (readmeData, tpa) => {
const creators = [];
     return inquirer.prompt([
            
        {
            type: 'input',
            name: 'creator',
            message: 'Enter the name of the creator.',
            validate: creatorInput => {
                if(creatorInput){
                     return true;
                }else{
                    console.log('You have to enter the name of the creator.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'creatorLink',
            message: 'Enter the link of the creator webpage.',
            validate: creatorInput => {
                if(creatorInput){
                     return true;
                }else{
                    console.log('You have to enter the link of the creator webpage.');
                    return false;
                }
            }
        },
        {
            type: 'confirm',
            name: 'confirmAnother',
            message: 'Would you like to add another creator for this asset?',
            default: false            
        }
       
    ])
        .then (creatorData => {
            const newCreator = new creator(creatorData.creator, creatorData.creatorLink, creatorData.confirmAnother);
            tpa.adding(newCreator);
                if(creatorData.confirmAnother){
                return thirdPartCreators(readmeData, tpa);
            }else{
                return thirdPartAssets(readmeData, tpa);
            }
        
        });
    };

 const tutorials = readmeData => {
    if(!readmeData.credits.tutorials ){
        readmeData.credits.tutorials = [];
    }
     return inquirer.prompt([
        {
            type: 'confirm',
            name: 'tutorials',
            message: 'Would you like to add a link of a tutorial used?',
            default: false
        },
        {
            type: 'input',
            name: 'link',
            message: 'Enter the link of the tutorial.',
            validate: linkInput => {
                if(linkInput){
                     return true;
                }else{
                    console.log('You have to enter the link for the tutorial.');
                    return false;
                }
            },
            when: ({tutorials}) => tutorials
        }
        
     ])
     .then (tutorialData => {
        readmeData.credits.tutorials.push(tutorialData);
        if(tutorialData.tutorials){
            return tutorials(readmeData);
        }else{
            return readmeData;
        }
      });
 };  
 
 const license = readmeData => {
     if(!readmeData.license){
         readmeData.license = [];
     }
     return inquirer.prompt([
        {
            type: 'confirm',
            name: 'license',
            message: 'Would you like to add a license for your project?',
            default: false
        },
        {
            type: 'list',
            name: 'licenseChoice',
            message: 'Chose here your license.',
            choices: ['MIT', 'GPL-2.0', 'Apache-2.0', 'GPL-3.0', 'BSD-2-Clause', 'ISC'],
            when: ({license}) => license,
            validate: licenseChoice => {
                if(licenseChoice){
                     return true;
                }else{
                    console.log('You have to chose a license.');
                    return false;
                }
            },
        },
        {
            type: 'input',
            name: 'owner',
            message: 'Enter your full name.',
            validate: owner => {
                if(owner){
                     return true;
                }else{
                    console.log('You have to enter your name.');
                    return false;
                }
            },
            when: ({license}) => license
        }
     ])
     .then( licenseData => {
         readmeData.license.push(licenseData);
         return readmeData;
     });

 };

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, err => {
        if (err) throw new Error (err);

        console.log('README.md file generated with success!');
    });
};

// TODO: Create a function to initialize app
function init() {
    questions()
    .then(screenshots)
    .then(colaborators)
    .then(thirdPartAssets)
    .then(tutorials)
    .then(license)
    .then(readmeData => {
        const readmeMD = generateMarkdown(readmeData);
        writeToFile('README.md', readmeMD);       
    });
}

// Function call to initialize app
init();


