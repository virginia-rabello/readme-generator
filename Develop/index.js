const fs = require('fs');
const util = require('util');
const inquirer = require('inquirer');
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

const thirdPartAssets = readmeData => {
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
        readmeData.credits.tpa.push(tpaData);
        if(tpaData.confirmTpa){
            if(tpaData.tpaCreator && tpaData.confirmTpa){
               return thirdPartCreators(readmeData);
            }else{
            return thirdPartAssets(readmeData);
            }
        }
       
        else{
            return readmeData;
        }
    });
};

const thirdPartCreators = (readmeData) => {

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
            readmeData.credits.tpa.push(creatorData);
            if(creatorData.confirmAnother){
                return thirdPartCreators(readmeData);
            }else{
                return thirdPartAssets(readmeData);
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
            type: 'input',
            name: 'link',
            message: 'Enter the link of the license.',
            validate: linkInput => {
                if(linkInput){
                     return true;
                }else{
                    console.log('You have to enter the link for the license.');
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

questions()
.then(colaborators)
.then(thirdPartAssets)
.then(tutorials)
.then(license)
.then(readmeData => {
    
    console.log(util.inspect(readmeData, false, null, true));
});


// TODO: Create a function to write README file
//function writeToFile(fileName, data) {}

// TODO: Create a function to initialize app
//function init() {}

// Function call to initialize app
//init();


