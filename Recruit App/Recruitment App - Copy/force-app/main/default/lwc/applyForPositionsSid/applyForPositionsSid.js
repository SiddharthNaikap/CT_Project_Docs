import { LightningElement,track,wire,api } from 'lwc';
import getOpenPositions from '@salesforce/apex/PositionDetailsSid.getOpenPositions';
import getSkills from '@salesforce/apex/PositionDetailsSid.getSkills' 
import getCandidates from '@salesforce/apex/PositionDetailsSid.getCandidates'
import { refreshApex } from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import createApplication from '@salesforce/apex/PositionDetailsSid.createApplication';


import POSITION_CODE from '@salesforce/schema/Position__c.Position_Code__c';
import CANDIDATE_CODE from '@salesforce/schema/Candidate__c.Name';

export default class ApplyForPositionsSid extends LightningElement {

@api recordId;

positionValue = '';
skillData = []
results =[]
wiredSkills=[];
candidateData=[];
skillSet=[];
recordsCount = 0;
isTrue = true;
selectedRecords = [];

columns=[{ label: 'Skills', fieldName: 'SkillName' }]

candidateColumn=[
{label:'Candidate Code',fieldName:'CandidateCode', sortable:true},
{label:'Candidate Name',fieldName:'FullName', sortable:true},
{ label: 'Contact Email', fieldName: 'Email', type: 'email' },
{ label: 'Phone Number', fieldName: 'Phone', type: 'phone' },
{label:'Skill Set',fieldName:'SkillSet', sortable:true},
{label:'Experience (Years)',fieldName:'TotalExp', sortable:true},
{type: "button", typeAttributes: {  
    label: 'Apply',  
    name: 'Apply',  
    variant: 'Success',
    title: 'Apply',  
    disabled: false,  
    value: 'Apply', 
    iconName:'utility:save', 
    iconPosition: 'center'  
}},]

handleChange(event) {
        this.positionValue = event.detail.value;
        // this.positionId=event.detail.PosId;
alert(JSON.stringify(this.positionValue));
        // this.wiredSkills=this.skilSet;

     getSkills({positionCode:this.positionValue})
    .then(response=>{
        // this.wiredSkills=response;
        let parsedData = JSON.parse(JSON.stringify(response));
        let skills=[];
        let skillSets=[];
        for(var i=0;i<parsedData.length;i++){
            skills.push({"SkillName":parsedData[i].Skill_Name__r.Name})
            skillSets.push(parsedData[i].Skill_Name__r.Name)
            
        }
    
    this.skillData=skills
    // alert(skillSet)
    this.skillSet=skillSets;
    // refreshApex(this.wiredSkills);
    // alert(this.skillSet);
    if(this.skillData){

        getCandidates({skills:this.skillSet})
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

        let conIds = new Set();
        this.isTrue=false;
        // getting selected record id
        for (let i = 0; i < selectedRows.length; i++) {
            conIds.add(selectedRows[i].CandidateCode);
        }
        // coverting to array
        this.selectedRecords = Array.from(conIds);
        // window.console.log('selectedRecords ====> ' +this.selectedRecords);
    }

    applySelected() {
        if (this.selectedRecords && this.recordsCount) {

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!', 
                    message: ''+this.selectedRecords, 
                    variant: 'success'
                }),
            );
            
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

callRowAction( event ) {  
       
        
        const PositionCode = this.positionValue 
        const CandidateId = event.detail.row.CanID;
        const CandidateCode =  event.detail.row.CandidateCode; 
        const CandidateName =  event.detail.row.FullName; 
        const CandiateSkills =  event.detail.row.SkillSet; 
        const CandidateExp =  event.detail.row.TotalExp; 
         
        const actionName = event.detail.action.name;  
        if ( actionName === 'Apply' ) {  
  
             alert('Position Record ID : '+PositionCode+'\nCandidate Record ID : '+CandidateId);

            // this[NavigationMixin.Navigate]({  i
            //     type: 'standard__recordPage',  
            //     attributes: {  
            //         recordId: recId,  
            //         objectApiName: 'Account',  
            //         actionName: 'edit'  
            //     }  
            // })  
   
            createApplication({posCode:'a055j0000049Oj1AAE', candCode:'a085j000003ee0GAAQ'})
            .then(result =>{
                // alert(response.applicationID);
                // console.log(response);
                alert("Result is :" + JSON.stringify(result));
                // this.dispatchEvent(
                //     new ShowToastEvent({
                //         title: 'Application Info!', 
                //         message: ''+response,
                //         variant: 'success'
                //     }),
                // );
                
            })
            .catch(error => { 
                alert("error is :" + JSON.stringify(error));
            })
            

            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Application Info!', 
            //         message: 'Position Code : '+PositionCode+'\n'+
            //         'Candidate Code : '+CandidateCode+'\nCandidate Name : '+CandidateName+
            //         '\nCandiateSkills : '+CandiateSkills+'\nCandidate Experience : '+CandidateExp+' Yrs.', 
            //         variant: 'success'
            //     }),
            // );
            

            // alert('### Application Info ###\n\n'+'Position Code : '+PositionCode+
            // '\nCandidate Code : '+CandidateCode+'\nCandidate Name : '+CandidateName+
            // '\nCandiateSkills : '+CandiateSkills+'\nCandidate Experience : '+CandidateExp+' Yrs.')
  
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