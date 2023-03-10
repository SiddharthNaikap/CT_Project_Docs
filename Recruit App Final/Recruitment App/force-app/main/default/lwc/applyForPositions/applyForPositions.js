import { LightningElement,track,wire,api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import getOpenPositions from '@salesforce/apex/PositionDetails.getOpenPositions';
import getSkills from '@salesforce/apex/PositionDetails.getSkills' 
import getCandidates from '@salesforce/apex/PositionDetails.getCandidates'
import createApplication from '@salesforce/apex/PositionDetails.createApplication';


export default class ApplyForPositions extends LightningElement {

positionValue = '';
applicationCount='14'


results =[]
wiredSkills=[];
candidateData=[];

skillData = []
skillSet=[];
skillSetIDs=[];
recordsCount = 0;

selectedRecords = [];
selectedCandidateNames = [];

interviewDate='';
formatedDate='';

isTrue = true;
divHide='';
tableHide='hidden';
divHide1='';
tableHide1='hidden';
divHide2='';
tableHide2='hidden';
CandidateMessage= "Choose a Position to View Candidate Profiles..";

columns=[{ label: 'Position-Skill Code', fieldName: 'PosSkillCode' },
{ label: 'Skills', fieldName: 'SkillName' }]

candidateColumn=[
{label:'Candidate Code',fieldName:'CandidateCode', sortable:true},
{label:'Candidate Name',fieldName:'FullName', sortable:true},
{ label: 'Contact Email', fieldName: 'Email', type: 'email' },
{ label: 'Phone Number', fieldName: 'Phone', type: 'phone' },
{label:'Skill Set',fieldName:'SkillSet', sortable:true},
{label:'Experience (Years)',fieldName:'TotalExp', sortable:true},
{type: "button", typeAttributes: {  
    label: 'Apply Now',  
    name: 'Apply',  
    variant: 'Success',
    title: 'Apply Now',  
    disabled: false,  
    value: 'Apply', 
    iconName:'utility:save', 
    iconPosition: 'center'  
}},]

// setDate(event){
//     this.interviewDate=event.detail.value;
//     var date = new Date(this.interviewDate);
//     this.formatedDate=((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
// }
// get todaysDate() {
//     var date = new Date(this.interviewDate);
//     var today =((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
//     return today;

// }
// convertDate(){

//     var date = new Date(this.interviewDate);
//     this.formatedDate=((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
//     // var formattedDate= moment(this.interviewDateTime).format('MM/dd/yyyy, hh:mm a');
//     // inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH);
//     // outputFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy, hh:mm a", Locale.ENGLISH);
//     // date = LocalDate.parse(this.interviewDateTime, inputFormatter);
//     // formattedDate = outputFormatter.format(this.interviewDateTime);
//     // alert(this.interviewDate);
//     alert('Formated Date : '+  this.formatedDate)
// }

handleChange(event) {
        this.positionValue = event.detail.value;
        this.divHide='hidden';
        this.tableHide='';
        this.divHide1='hidden';
        this.tableHide1='';
        this.divHide2='hidden';
        this.tableHide2='';

     getSkills({positionCode:this.positionValue})
    .then(response=>{
        // this.wiredSkills=response;
        let parsedData = JSON.parse(JSON.stringify(response));
        // alert(JSON.stringify(response));
        let skills=[];
        let skillSets=[];
        let skillSetID=[];
        for(var i=0;i<parsedData.length;i++){
            skills.push({"SkillName":parsedData[i].Skill_Name__r.Name,"PosSkillCode":parsedData[i].Name});
            skillSets.push('%'+parsedData[i].Skill_Name__r.Name+'%');
            skillSetID.push(parsedData[i].Skill_Name__c);
            
        }
    
        this.skillSet=skillSets;
        // refreshApex(this.wiredSkills);
        this.skillData=skills;
        this.skillSetIDs=skillSetID;

    if(this.skillData){

        getCandidates({skills:this.skillSet,posCode:this.positionValue})
            .then(response=>{
    
                this.wiredSkills=response;
                let parsedData = JSON.parse(JSON.stringify(response));
                let canData=[];
                for(var i=0;i<parsedData.length;i++){
                    canData.push({
                        "CanID":parsedData[i].Id,
                        "CandidateCode":parsedData[i].Name,
                        "FullName":parsedData[i].First_Name__c+' '+parsedData[i].Last_Name__c,
                        "Email":parsedData[i].Email__c,
                        "Phone":parsedData[i].Phone_Number__c,
                        "SkillSet":parsedData[i].Skill_Set__c+'',
                        "TotalExp":parsedData[i].Total_Experiene__c
                    }
                    )
                }
            this.candidateData=canData;
            if( this.candidateData.length==0){
                this.CandidateMessage="Oops.. No matching Profiles found!";
                this.divHide1='';
                this.tableHide1='hidden';
            }
            refreshApex(this.wiredSkills);
            // alert(JSON.stringify(this.candidateData));
    
            })
            .catch(error=>{
                console.log('Error : '+error)
            })
        }
        refreshApex(this.wiredSkills);
    })
    .catch(error=>{
        console.log('Error : '+error)
    })
     }

getSelectedRecords(event) {
        // getting selected rows
        const selectedRows = event.detail.selectedRows;
        this.recordsCount = event.detail.selectedRows.length;

        let canIds = new Set();
        let canName = new Set();
        this.isTrue=false;
        // getting selected record id
        for (let i = 0; i < selectedRows.length; i++) {
            canIds.add(selectedRows[i].CanID);
            canName.add(selectedRows[i].FullName);
    
        }
        // coverting to array
        this.selectedRecords = Array.from(canIds);
        this.selectedCandidateNames=Array.from(canName);
        // window.console.log('selectedRecords ====> ' +this.selectedRecords);
    }

    applySelected() {
        // if(this.interviewDate==''){
        //     this.dispatchEvent(
        //         new ShowToastEvent({
        //             title: 'Warning!', 
        //             message: 'Please select Interview Date!!', 
        //             variant: 'warning'
        //         }),
        //     );
        // }
        if (this.selectedRecords && this.recordsCount) {

            for (let i = 0; i < this.selectedRecords.length; i++) {
                this.applyForPosition(this.positionValue,this.selectedRecords[i],this.skillSetIDs,this.selectedCandidateNames[i]);
                }
            this.template.querySelector('.dataTable').selectedRows=[];
            this.isTrue = true;

        }
        else{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Warning!', 
                    message: 'Please select one or more Rows', 
                    variant: 'warning'
                }),
            );
            
        }
    }


applyForPosition(posCode,candCode,skillIds,candName,intDate){

    // alert('Inside Apply method');

    createApplication({posCode:posCode, candCode:candCode,skillIds:skillIds,intDate:intDate})
    .then(result =>{
        // alert(response.applicationID);
        // console.log(response);
        // alert("Result is :" + JSON.stringify(result));
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success!', 
                message: result+' for '+candName,
                variant: 'success'
            }),
        );
        
    })
    .catch(error => { 
        alert("error is :" + JSON.stringify(error));
    })

}

callRowAction( event ) {  
       
        const PositionCode = this.positionValue ;
        const CandidateId = event.detail.row.CanID;
        // const CandidateCode =  event.detail.row.CandidateCode; 
        const CandidateName =  event.detail.row.FullName; 
        // const CandiateSkills =  event.detail.row.SkillSet; 
        // const CandidateExp =  event.detail.row.TotalExp; 
         
        const actionName = event.detail.action.name;  
        if ( actionName === 'Apply' ) {  
            // if(this.interviewDate==''){
            //     this.dispatchEvent(
            //         new ShowToastEvent({
            //             title: 'Warning!', 
            //             message: 'Please select Interview Date!!', 
            //             variant: 'warning'
            //         }),
            //     );
            // }
            //  alert('Position Record ID : '+PositionCode+'\nCandidate Record ID : '+CandidateId);
        //    else
            this.applyForPosition(PositionCode,CandidateId,this.skillSetIDs,CandidateName);
 
        }  
    }  

@track posData =[];

@wire(getOpenPositions)
wireData(result){
    
    if(result.data){
        
        let parsedData = JSON.parse(JSON.stringify(result.data));
        let lstOption = [];
        for (var i = 0;i < parsedData.length;i++) {
            lstOption.push({
                // value: parsedData[i].Name,
                value: parsedData[i].Id,
                "PosId":parsedData[i].Id,
                label: parsedData[i].Name+' ( Min. '+parsedData[i].Minimum_Experience_Required__c+' Years )'});
          }
          this.posData = lstOption;
        //   alert(JSON.stringify(this.posData));

  
    }
   else if (result.error) {
    console.error('Error : \n ', result.error);
}
}
         
}