import { LightningElement,wire,track,api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from '@salesforce/apex';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

import createAdditionalSkillFeedback from '@salesforce/apex/CandidateSkillFeedback.createAdditionalSkillFeedback';
import getAdditionalSkillFeedback from '@salesforce/apex/CandidateSkillFeedback.getAdditionalSkillFeedback';
import updateAdditionalSkillFeedback from '@salesforce/apex/CandidateSkillFeedback.updateAdditionalSkillFeedback';

import CANDIDATE_CODE from '@salesforce/schema/Candidate_Feedback__c.Candidate_Code__c';
import POSITION_CODE from '@salesforce/schema/Candidate_Feedback__c.Position__c';

const fields  = [
    CANDIDATE_CODE,
    POSITION_CODE
];

export default class CandidateOtherSkillsFeedback extends LightningElement {

    @api recordId;
    @api candCode='';
    @api posCode='';
    @api skillCategory ='Other Skills';
    @api skillName ='';
    @api skillRating='';
    @api skillComments='';
    @api viewInsert=false;

    options=[
        {label:'0',value:'0'},
        {label:'1',value:'1'},
        {label:'2',value:'2'},
        {label:'3',value:'3'},
        {label:'4',value:'4'},
        {label:'5',value:'5'}
    ]

    skillData =[];
    wiredSkills=[];
    draftValues =[];

    columns=[{ label: 'Skill Category', fieldName: 'Skill_Category__c', sortable:true},
        { label: 'Skill Name', fieldName: 'Other_Skills__c',editable: true },
        { label: 'Skill Rating(0-5)', type: 'picklistColumn',fieldName: 'Skill_Rating__c',editable: true,
            typeAttributes: {
            options: { fieldName: this.options },
            value: { fieldName: this.options },
        }
        },
        { label: 'Comments', fieldName: 'Comments__c',editable: true }];

    @wire(getRecord, { recordId: '$recordId', fields })
    loadFields({error, data}){
        
                if(error){
                    alert('error : '+JSON.stringify(error));
                }
                else if(data){
                    this.candCode =getFieldValue(data, CANDIDATE_CODE);
                    this.posCode = getFieldValue(data, POSITION_CODE);
                    console.log('Record Id:'+this.recordId+'\ncandidate Code : '+this.candCode+'\nposition code : '+this.posCode);

                    getAdditionalSkillFeedback({candidateCode:this.candCode,positionCode:this.posCode,candidateFeedbackCode:this.recordId})
                    .then(response=>{
                        let parsedData = JSON.parse(JSON.stringify(response));
                        let lstOption = [];
                        for (var i = 0;i < parsedData.length;i++) {
                        lstOption.push({
                        "Id":parsedData[i].Id,
                        "Skill_Category__c":'Other Skills',
                        "Other_Skills__c":parsedData[i].Other_Skills__c,
                        "Skill_Rating__c":parsedData[i].Skill_Rating__c,
                        "Comments__c":parsedData[i].Comments__c,
                        })
                        }
                        this.skillData = lstOption;
                        this.wiredSkills=lstOption;
                    })
                    .catch(error=>{
                        console.log('Error : '+error)
                    })
                    
                }
                    
            }
        

    handleClick(){
        this.viewInsert=true;
    }
    handleClose(){
        this.viewInsert=false; 
    }

    handleSkillChange(event){
        this.skillName =event.detail.value;
        // console.log(this.skillName);
        
    }
    handleRatingChange(event){
        this.skillRating =event.detail.value;
        // console.log(this.skillRating);
        
    }
    handleCommentChange(event){
        this.skillComments =event.detail.value;
        // console.log(this.skillComments);
        
    }
    clearData(){
        this.skillName ='';
        this.skillRating='';
        this.skillComments='';
    }

    retriveData(){
        getAdditionalSkillFeedback({candidateCode:this.candCode,positionCode:this.posCode,candidateFeedbackCode:this.recordId})
        .then(response=>{
            let parsedData = JSON.parse(JSON.stringify(response));
            let lstOption = [];
            for (var i = 0;i < parsedData.length;i++) {
            lstOption.push({
            "Id":parsedData[i].Id,
            "Skill_Category__c":'Other Skills',
            "Other_Skills__c":parsedData[i].Other_Skills__c,
            "Skill_Rating__c":parsedData[i].Skill_Rating__c,
            "Comments__c":parsedData[i].Comments__c,
            })
            }
            this.skillData = lstOption;
        })
        .catch(error=>{
            console.log('Error : '+error)
        })
    }
    async handleInsert(event){
        // alert(this.skillName +' '+this.skillRating+' '+this.skillComments);
        if( this.skillName==''|| this.skillRating==''){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Warning',
                    message: 'Please fill all the fields!',
                    variant: 'warning'
                })
            );
        }
        else{
            createAdditionalSkillFeedback({candidateFeedbackCode:this.recordId,candidateCode:this.candCode,positionCode:this.posCode,otherSkillName:this.skillName,rating:this.skillRating,comments:this.skillComments})
            .then(response=>{
                let result = JSON.parse(JSON.stringify(response));
                console.log(result);
    
                if(result==="Success"){
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Insertion Successful',
                            variant: 'success'
                        })
                    );
                    this.clearData();
                    // this.retriveData();
                   getAdditionalSkillFeedback({candidateCode:this.candCode,positionCode:this.posCode,candidateFeedbackCode:this.recordId})
                    .then(response=>{
                        let parsedData = JSON.parse(JSON.stringify(response));
                        let lstOption = [];
                        for (var i = 0;i < parsedData.length;i++) {
                        lstOption.push({
                        "Id":parsedData[i].Id,
                        "Skill_Category__c":'Other Skills',
                        "Other_Skills__c":parsedData[i].Other_Skills__c,
                        "Skill_Rating__c":parsedData[i].Skill_Rating__c,
                        "Comments__c":parsedData[i].Comments__c,
                        })
                        }
                        this.skillData = lstOption;
                    })
                    .catch(error=>{
                        console.log('Error : '+error)
                    })
                }
                else{
                    // console.log(JSON.stringify(error));
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating feedback record',
                            message: ''+JSON.stringify(error),
                            variant: 'error'
                        })
                  );
                }
            })
            .catch(error=>{
                console.log('Error : '+error)
            })
        }
  
       
    }

   async handleSave(event){
    const updatedFields = event.detail.draftValues;
    //alert(JSON.stringify(updatedFields));
     // this.changedSkills=this.draftValues;
     // Prepare the record IDs for getRecordNotifyChange()
     const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id} });
     
     try {
         // Pass edited fields to the updateContacts Apex controller
         const result = await updateAdditionalSkillFeedback({data: updatedFields});
         console.log(JSON.stringify("Apex update result: "+ result));
         // refreshApex(this.wiredSkills);
         this.dispatchEvent(
             new ShowToastEvent({
                 title: 'Success',
                 message: 'Successfuly Updated Feedback!',
                 variant: 'success'
             })
         );
         getRecordNotifyChange(notifyChangeIds);  
         // Clear all draft values in the datatable
         this.draftValues = [];  
         this.retriveData();
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