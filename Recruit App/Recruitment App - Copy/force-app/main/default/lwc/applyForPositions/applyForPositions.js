import { LightningElement,track,wire,api } from 'lwc';
import getOpenPositions from '@salesforce/apex/PositionDetails.getOpenPositions';
import getSkills from '@salesforce/apex/PositionDetails.getSkills' 
import getCandidates from '@salesforce/apex/PositionDetails.getCandidates'
import { refreshApex } from '@salesforce/apex';
import createApplication from '@salesforce/apex/PositionDetails.createApplication';

export default class ApplyForPositions extends LightningElement {

positionValue = '';
skillData = []
results =[]
wiredSkills=[];
candidateData=[];
skillSet=[];


columns=[{ label: 'Skills', fieldName: 'SkillName' }]

candidateColumn=[
{label:'Candidate Code',fieldName:'CandidateCode'},
{label:'Candidate Name',fieldName:'FullName'},
{label:'Skill Set',fieldName:'SkillSet'},
{label:'Experience',fieldName:'TotalExp'},
{type: "button", typeAttributes: {  
    label: 'Apply',  
    name: 'Apply',  
    variant: 'Success',
    title: 'Apply',  
    disabled: false,  
    value: 'Apply',  
    iconPosition: 'center'  
}},]

handleChange(event) {
        this.positionValue = event.detail.value;
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
        // alert(JSON.stringify(this.skillData))
                
            // var skillss=[];
            // let parsedData1 = JSON.parse(JSON.stringify(this.skillData));
            // for(var h=0;h<this.skillData.length;h++){
            //     skillss.push(skillData[i]['SkillName']);
    
            // }
            // alert(skillss);
            
            
            // var SkillSets=['CSS','javascript'];
            getCandidates({skills:this.skillSet})
            .then(response=>{
    
                this.wiredSkills=response;
                let parsedData = JSON.parse(JSON.stringify(response));
                let canData=[];
                for(var i=0;i<parsedData.length;i++){
                    canData.push({
                        "CandidateCode":parsedData[i].Name,
                        "FullName":parsedData[i].First_Name__c+' '+parsedData[i].Last_Name__c,
                        "SkillSet":parsedData[i].Skill_Set__c+'',
                        "TotalExp":parsedData[i].Total_Experiene__c
                    }
                    )
                }
            this.candidateData=canData
            refreshApex(this.wiredSkills);
            // alert(this.candidateData)
    
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

callRowAction( event ) {  

        const PositionCode = this.positionValue;  
        const CandidateCode =  event.detail.row.CandidateCode; 
        const CandidateName =  event.detail.row.FullName; 
        const CandiateSkills =  event.detail.row.SkillSet; 
        const CandidateExp =  event.detail.row.TotalExp; 
         
        const actionName = event.detail.action.name;  
        if ( actionName === 'Apply' ) {  
  
            // this[NavigationMixin.Navigate]({  i
            //     type: 'standard__recordPage',  
            //     attributes: {  
            //         recordId: recId,  
            //         objectApiName: 'Account',  
            //         actionName: 'edit'  
            //     }  
            // })  
      

            // createApplication({posCode : PositionCode, candCode : CandidateCode } )
            // .then(response =>{
            //     alert(response.applicationID);
            //     console.log(response);
            // })
            // .catch(error => { 
            //     console.log("error is" + error);
            // })
            // alert(appcreate);

            

            alert('### Application Info ###\n\n'+'Position Code : '+PositionCode+
            '\nCandidate Code : '+CandidateCode+'\nCandidate Name : '+CandidateName+
            '\nCandiateSkills : '+CandiateSkills+'\nCandidate Experience : '+CandidateExp+' Yrs.')
  
        }  
    }  

@track posData =[];

@wire(getOpenPositions)
wireData(result){
    
    if(result.data){
        
        let parsedData = JSON.parse(JSON.stringify(result.data));
        let lstOption = [];
        for (var i = 0;i < parsedData.length;i++) {
            lstOption.push({value: parsedData[i].Name,label: parsedData[i].Name+' ( Min. '+parsedData[i].Minimum_Experience_Required__c+' Years )'});
          }
          this.posData = lstOption;

  
    }
   else if (result.error) {
    console.error('Error : \n ', result.error);
}
}
  
        
}