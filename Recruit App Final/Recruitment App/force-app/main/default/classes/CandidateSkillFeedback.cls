public with sharing class CandidateSkillFeedback {

    @AuraEnabled
    public static String createAdditionalSkillFeedback(String candidateFeedbackCode,String candidateCode,String positionCode,String otherSkillName,String rating,String comments){

        try{
        Candidate_Skill_Feedback__c candidateSkillFedback = new Candidate_Skill_Feedback__c(
            Candidate_Code__c = candidateCode,
            Candidate_Feedback_Code__c = candidateFeedbackCode,
            Position__c = positionCode,
            Other_Skills__c = otherSkillName,
            Skill_Rating__c = rating,
            Comments__c=comments
        );
        insert candidateSkillFedback;
        return 'Success';
        }
        catch(Exception e){
            return 'The following exception has occurred: ' + e.getMessage();
        }
    }

    @AuraEnabled
    public static List<Candidate_Skill_Feedback__c> getAdditionalSkillFeedback(String candidateCode,String positionCode,String candidateFeedbackCode){

        // system.debug(Cand_Feedback_id);
        try {

            return [Select Other_Skills__c,Skill_Rating__c,Comments__c from Candidate_Skill_Feedback__c where Skill_Category__c=null and Candidate_Code__c=:candidateCode and Position__c=:positionCode and Candidate_Feedback_Code__c=:candidateFeedbackCode Order By Other_Skills__c];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static string updateAdditionalSkillFeedback(Object data) {
        try {
    List<Candidate_Skill_Feedback__c> candidateFeedbackForUpdate = (List<Candidate_Skill_Feedback__c>) JSON.deserialize(
         JSON.serialize(data),
         List<Candidate_Skill_Feedback__c>.class
    );
    
        update candidateFeedbackForUpdate;
        return 'Success: Skills updated successfully';
    }
    catch (Exception e) {
        return 'The following exception has occurred: ' + e.getMessage();
    }
}
}
