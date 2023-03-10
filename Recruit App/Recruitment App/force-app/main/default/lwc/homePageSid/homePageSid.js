import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import interviewsToday from '@salesforce/apex/PositionDetailsSid.interviewsToday';
import { updateRecord } from "lightning/uiRecordApi";
import { createRecord } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import ID_FIELD from '@salesforce/schema/Application__c.Id';
import INT_LEVEL from '@salesforce/schema/Application__c.Status__c';



export default class HomePageSid extends LightningElement {

    column=[
        {label:'Position',fieldName:'Position__c', sortable:true},
        {label:'Candidate Code',fieldName:'Candidate_Code__c', sortable:true},
        { label: 'Candidate Name', fieldName: 'Candidate_Full_Name__c',sortable:true},
        { label: 'Interview Level', fieldName: 'Interview_Level__c',sortable:true},
        // { label: 'Date', fieldName: 'Interview_Date__c',sortable:true  },
        {label:'Time',fieldName:'Interview_Time__c', type:'time'},
        {type: "button", typeAttributes: {  
            label: 'Take Interview',  
            name: 'TakeInterview',  
            variant: 'Brand',
            title: 'Take Interview',  
            disabled: false,  
            value: 'TakeInterview'
        }}];

    interviewData=[];
    wiredSkills=[];
    
    recordID='';
    candFeedbackCode='';
    positionCode='';
    candidateCode='';
    candidateName='';
    interviewLevel='';
    Application_Number__c='';
    // Application_Number__c_Name='';
    targetLevel='';

    totalHired='3'
    totalRejections='16'
    interviewsToday='0'
    interviewsScheduled='8'

    isShowModal = false;
    showTable=true;

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }

@wire(interviewsToday)
wireData(result){
    
    if(result.data){
        this.wiredSkills=result.data;
        let parsedData = JSON.parse(JSON.stringify(result.data));
        // alert(JSON.stringify(result.data));

        if(parsedData.length==0){
            this.showTable=false;
        }
       
        else{
            let canData=[];
            this.interviewsToday=parsedData.length;
            for(var i=0;i<parsedData.length;i++){
                const d = new Date(parsedData[i].Interview_Time__c-19800000);
                let time =  d.toLocaleTimeString();
                canData.push({
                    "Application_Number__c":parsedData[i].Application_Number__c,
                //    "Application_Number__c_Name": parsedData[i].Application_Number__r.Name,
                    "CandFeedbackCode":parsedData[i].Name,
                    "RecordID":parsedData[i].Id,
                    "Position__c":parsedData[i].Position__r.Name,
                    "Candidate_Code__c":parsedData[i].Candidate_Code__r.Name,
                    "Position__code":parsedData[i].Position__c,
                    "Candidate_Code__code":parsedData[i].Candidate_Code__c,
                    "Candidate_Full_Name__c":parsedData[i].Candidate_Full_Name__c,
                    "Interview_Level__c": parsedData[i].Interview_Level__c,
                    "Interview_Date__c":parsedData[i].Interview_Date__c,
                    "Interview_Time__c": time
                }
                )
            }
        this.interviewData=canData;
        this.showTable=true;
        refreshApex(this.wiredSkills);

        }
 
  
    }
   else if (result.error) {
    console.error('Error : \n ', result.error);
}
}


callRowAction( event ) {  
       
    this.recordID=event.detail.row.RecordID;
    this.Application_Number__c=event.detail.row.Application_Number__c;
    // this.Application_Number__c_Name=event.detail.row.Application_Number__c_Name;
    this.candFeedbackCode=event.detail.row.CandFeedbackCode;
    this.positionCode=event.detail.row.Position__code;
    this.candidateCode=event.detail.row.Candidate_Code__code;
    // this.candidateName=event.detail.row.Candidate_Full_Name__c;
// alert(this.Application_Number__c);
    this.interviewLevel=event.detail.row.Interview_Level__c;

    const actionName = event.detail.action.name;  
    if ( actionName === 'TakeInterview' ) {  
   
    //    alert(this.recordID);
    this.isShowModal = true;

    }  
}  

handleApprove(){
// alert('Inside Approve');

if(this.interviewLevel=='L1'){
this.targetLevel='L2';
}
else if(this.interviewLevel=='L2'){
    this.targetLevel='Managerial';
    }
else if(this.interviewLevel=='Managerial'){
    this.targetLevel='HR';
 }
 else if(this.interviewLevel=='HR'){
    this.targetLevel='Hired';
}
// alert(this.targetLevel);
const fields = {};
fields[ID_FIELD.fieldApiName] =  this.Application_Number__c;
fields[INT_LEVEL.fieldApiName] = this.targetLevel;
const recordInput = {
    fields: fields
  };
// alert(JSON.stringify(recordInput));

updateRecord(recordInput)
    .then(() => {

            this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success!',
                message: 'Candidate is Approved to next Level',
                variant: 'success'
            }))

if(this.interviewLevel!='HR'){
            // Creating mapping of fields of Account with values
            var fields = {'Candidate_Code__c' : this.candidateCode ,
            'Position__c' : this.positionCode,'Application_Number__c': this.Application_Number__c,
            'Interview_Level__c':this.targetLevel};
            // Record details to pass to create method with api name of Object.
            // alert(JSON.stringify(fields));
            var objRecordInput = {'apiName' : 'Candidate_Feedback__c', fields:fields};
            // LDS method to create record.
            createRecord(objRecordInput).then(response => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!',
                        message: 'Record Created for Next Level of Interview.',
                        variant: 'success'
                    }))
    
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error Updating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
}
        

    })
    .catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error Updating record',
                message: error.body.message,
                variant: 'error'
            })
        );
    });

}

handleReject(){
    // alert(this.Application_Number__c);
    const fields = {};
    fields[ID_FIELD.fieldApiName] =  this.Application_Number__c;
    fields[INT_LEVEL.fieldApiName] = this.interviewLevel+' Rejected';
    const recordInput = {
        fields: fields
      };
    // alert(JSON.stringify(recordInput));

    updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!',
                    message: 'Candidate is Rejected at '+this.interviewLevel+' Level',
                    variant: 'success'
                })
            );
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Updating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
}

}