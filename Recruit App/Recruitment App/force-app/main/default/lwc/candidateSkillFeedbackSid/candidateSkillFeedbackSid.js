import { LightningElement,wire,track,api } from 'lwc';
import getPositionSkillFeedback from '@salesforce/apex/PositionDetailsSid.getPositionSkillFeedback';
import updatePositionSkillFeedback from '@salesforce/apex/PositionDetailsSid.updatePositionSkillFeedback';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from '@salesforce/apex';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

import CANDIDATE_CODE from '@salesforce/schema/Candidate_Feedback__c.Candidate_Code__c';
import POSITION_CODE from '@salesforce/schema/Candidate_Feedback__c.Position__c';

const fields  = [
    CANDIDATE_CODE,
    POSITION_CODE
];

export default class CandidateSkillFeedbackSid extends LightningElement {

@api recordId;
@api candCode='';
@api posCode='';
draftValues =[];
candidatePosSkills=[];
wiredSkills=[];
columns=[{ label: 'Skill Name', fieldName: 'Skill_Name__r.Name' },
        { label: 'Skill Rating(0-5)', fieldName: 'Skill_Rating__c',editable: true},
        { label: 'Feedback/Comments', fieldName: 'Comments__c',editable: true }];


@wire(getRecord, { recordId: '$recordId', fields })
loadFields({error, data}){
    
    this.wiredSkills=this.candidatePosSkills;
            if(error){
                alert('error : '+JSON.stringify(error));
            }
            else if(data){
                // alert('data : '+JSON.stringify(data));
                this.candCode =getFieldValue(data, CANDIDATE_CODE);
                this.posCode = getFieldValue(data, POSITION_CODE);
                // console.log('paramField1', paramField1);
                // console.log('paramField2', paramField2);
                // alert('candidate Code : '+this.candCode+'\nposition code : '+this.posCode);
            
                getPositionSkillFeedback({candidateCode:this.candCode,positionCode:this.posCode})
                .then(response=>{
                    let parsedData = JSON.parse(JSON.stringify(response));
                    let lstOption = [];
                    for (var i = 0;i < parsedData.length;i++) {
                    lstOption.push({
                    "Id":parsedData[i].Id,
                    "Skill_Name__r.Name":parsedData[i].Skill_Name__r.Name,
                    "Skill_Rating__c":parsedData[i].Skill_Rating__c,
                    "Comments__c":parsedData[i].Comments__c,
                    })
                    }
                    this.candidatePosSkills = lstOption;
                })
                .catch(error=>{
                    console.log('Error : '+error)
                })
                
            }
            refreshApex(this.wiredSkills);
        }


async handleSave(event) {

   const updatedFields = event.detail.draftValues;
    
    // Prepare the record IDs for getRecordNotifyChange()
    const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id} });
    this.wiredSkills=this.candidatePosSkills;
    try {
        // Pass edited fields to the updateContacts Apex controller
        const result = await updatePositionSkillFeedback({data: updatedFields});
        console.log(JSON.stringify("Apex update result: "+ result));
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Successfuly Updated Candidate Skill Rating',
                variant: 'success'
            })
        );

        // Refresh LDS cache and wires
        // getRecordNotifyChange(notifyChangeIds);
        getRecordNotifyChange(notifyChangeIds);  
        // Display fresh data in the datatable
        // refreshApex(this.wiredSkills);
        // refreshApex(this.candidatePosSkills);
            // Clear all draft values in the datatable
           this.draftValues = []; 
           refreshApex(this.wiredSkills);
        // event.detail.onsave='';
 
            

   } 
   catch(error) {
           this.dispatchEvent(
               new ShowToastEvent({
                   title: 'Error updating or refreshing records',
                   message: ''+error,
                   variant: 'error'
               })
         );
    };

}

}