import { LightningElement,wire,track,api } from 'lwc';
import getPositionSkillFeedback from '@salesforce/apex/PositionDetails.getPositionSkillFeedback';
import updatePositionSkillFeedback from '@salesforce/apex/PositionDetails.updatePositionSkillFeedback';
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

export default class CandidateSkillFeedback extends LightningElement {

      
@api recordId;
@api candCode='';
@api posCode='';
draftValues =[];
candidatePosSkills=[];
wiredSkills=[];

changedSkills=[];
columns=[{ label: 'Skill Category', fieldName: 'Skill_Category__c', sortable:true},
        { label: 'Skill Name', fieldName: 'Skill_Name__r.Name' },
        { label: 'Skill Rating(0-5)', fieldName: 'Skill_Rating__c',editable: true},
        { label: 'Comments', fieldName: 'Comments__c',editable: true }];


@wire(getRecord, { recordId: '$recordId', fields })
loadFields({error, data}){
    
    // this.wiredSkills=this.candidatePosSkills;
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
            
                getPositionSkillFeedback({candidateCode:this.candCode,positionCode:this.posCode,candidateFeedbackCode:this.recordId})
                .then(response=>{
                    let parsedData = JSON.parse(JSON.stringify(response));
                    let lstOption = [];
                    for (var i = 0;i < parsedData.length;i++) {
                    lstOption.push({
                    "Id":parsedData[i].Id,
                    "Skill_Category__c":parsedData[i].Skill_Category__c,
                    "Skill_Name__r.Name":parsedData[i].Skill_Name__r.Name,
                    "Skill_Rating__c":parsedData[i].Skill_Rating__c,
                    "Comments__c":parsedData[i].Comments__c,
                    })
                    }
                    this.candidatePosSkills = lstOption;
                    this.wiredSkills=lstOption;
                })
                .catch(error=>{
                    console.log('Error : '+error)
                })
                
            }
            // refreshApex(this.wiredSkills);
        }


async handleSave(event) {

    // alert(this.recordId);
   const updatedFields = event.detail.draftValues;
//    alert(JSON.stringify(updatedFields));
    // this.changedSkills=this.draftValues;

    // Prepare the record IDs for getRecordNotifyChange()
    const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id} });
    
    try {
        // Pass edited fields to the updateContacts Apex controller
        const result = await updatePositionSkillFeedback({data: updatedFields});
        console.log(JSON.stringify("Apex update result: "+ result));
        // refreshApex(this.wiredSkills);
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

        // const dt = this.template.querySelector('lightning-datatable');
        // dt.editable=false;
        // this.candidatePosSkills = event.detail.draftValues;
        getPositionSkillFeedback({candidateCode:this.candCode,positionCode:this.posCode,candidateFeedbackCode:this.recordId})
        .then(response=>{
            let parsedData = JSON.parse(JSON.stringify(response));
            let lstOption = [];
            for (var i = 0;i < parsedData.length;i++) {
            lstOption.push({
            "Id":parsedData[i].Id,
            "Skill_Category__c":parsedData[i].Skill_Category__c,
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

        // Display fresh data in the datatable
        // refreshApex(this.wiredSkills);
        // refreshApex(this.candidatePosSkills);
            // Clear all draft values in the datatable
        this.draftValues = []; 
       // refreshApex(this.changedSkills);
        // updateRecord({ fields: { Id: this.recordId } });
    // window.location.reload();            

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

updateRecordView() {
    window.location.reload();
    // setTimeout(() => {
    //     eval("$A.get('e.force:refreshView').fire();");
    //     }, 3000);

 }

}