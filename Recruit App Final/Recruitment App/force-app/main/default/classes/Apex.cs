Apex 
##################

public with sharing class PositionDetails {


    @AuraEnabled(cacheable=true)
    public static List<Candidate_Feedback__c> interviewsToday(){
    
        return [Select  Position__c,Candidate_Code__c,Application_Number__c,Name,Id,Position__r.Name,Candidate_Code__r.Name,Candidate_Full_Name__c,Interview_Level__c,Interview_Date__c,Interview_Time__c from Candidate_Feedback__c where Interview_Date__c =TODAY ORDER BY Interview_Time__c ASC];
    }

    

    @AuraEnabled(cacheable=true)
    public static List<Candidate__C> getCandidates(List<String> skills,String posCode){   //[java,php,react]

       List<String> candData=new List<String>();
        for(Application__c canD:[Select Candidate_Code__r.Name from Application__c where (not Status__c like '%rejected%') and Position_Code__c=:posCode]){
            candData.add(canD.Candidate_Code__r.Name);
        }
          
        List<Candidate__C> accList = [SELECT Name,First_Name__c,Last_Name__c,Email__c,Phone_Number__c,Total_Experiene__c,Skill_Set__c from Candidate__c where Skill_Set__c Like:skills and Name Not In:candData];
        return accList;
   }


    @AuraEnabled
    public static string createApplication(String posCode, String candCode,List<String> skillIds){ 
        
        try {
            Application__c appln = new Application__c(
                Position_Code__c = posCode,
                Candidate_Code__c = candCode
                 );
            insert appln;
            String applicationID = appln.ID;

            if(applicationID!=''){
                Candidate_Feedback__c candidateFeedback = new Candidate_Feedback__c(
                    Application_Number__c =applicationID,
                    Position__C=posCode,
                    Candidate_Code__c = candCode
                    // Interview_Date__c= Date.parse(intDate)
                );
                insert candidateFeedback;
                String candidateFeedbackId = candidateFeedback.ID;

                List<Candidate_Skill_Feedback__c> candidateSkillFeedback= new List<Candidate_Skill_Feedback__c>();
                
                for(String skill:skillIds){
                    candidateSkillFeedback.add(
                        new Candidate_Skill_Feedback__c(
                            Candidate_Code__c=candCode,
                            Candidate_Feedback_Code__c=candidateFeedbackId,
                            Skill_Name__c=skill,
                            Position__c=posCode)
                    );
                    // Candidate_Skill_Feedback__c CSF= new Candidate_Skill_Feedback__c(
                    // Candidate_Code__c=candCode,
                    // Skill_Name__c=skill,
                    // Position__c=posCode);
                    // insert(CSF);
                    // System.debug(skill);
                }
                insert candidateSkillFeedback;
            }

            return 'Application Submitted Successfully';
            
        } catch (Exception e) {
            system.debug(e.getLineNumber()+'::'+e.getMessage());
            return 'Insert Failed '+e;
        }
    }

    @AuraEnabled
    public static List<Candidate_Skill_Feedback__c> getPositionSkillFeedback(String candidateCode,String positionCode,String candidateFeedbackCode){

        // system.debug(Cand_Feedback_id);
        try {

            return [Select Skill_Category__c,Skill_Name__r.Name,Skill_Rating__c,Comments__c from Candidate_Skill_Feedback__c where Skill_Category__c !=null and Candidate_Code__c=:candidateCode and Position__c=:positionCode and Candidate_Feedback_Code__c=:candidateFeedbackCode Order By Skill_Category__c];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static string updatePositionSkillFeedback(Object data) {
        try {
    List<Candidate_Skill_Feedback__c> contactsForUpdate = (List<Candidate_Skill_Feedback__c>) JSON.deserialize(
         JSON.serialize(data),
         List<Candidate_Skill_Feedback__c>.class
    );
    
        update contactsForUpdate;
        return 'Success: contacts updated successfully';
    }
    catch (Exception e) {
        return 'The following exception has occurred: ' + e.getMessage();
    }
}
}