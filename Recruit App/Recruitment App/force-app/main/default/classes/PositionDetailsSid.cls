public with sharing class PositionDetailsSid {


    @AuraEnabled(cacheable=true)
    public static List<Candidate_Feedback__c> interviewsToday(){
    
        return [Select  Position__c,Candidate_Code__c,Application_Number__c,Name,Id,Position__r.Name,Candidate_Code__r.Name,Candidate_Full_Name__c,Interview_Level__c,Interview_Date__c,Interview_Time__c from Candidate_Feedback__c where Interview_Date__c =TODAY ORDER BY Interview_Time__c ASC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Position__c> getOpenPositions(){

        return [SELECT Name,Minimum_Experience_Required__c,Position_Code__c FROM Position__c WHERE Status__c ='Active'];
    }

    @AuraEnabled(cacheable=true)
    public static List<Position_Skill__c> getSkills(String positionCode){
        return [SELECT Name,Skill_Name__r.Name From Position_Skill__c WHERE Position_Code__r.id =:positionCode];
    }

    @AuraEnabled(cacheable=true)
    public static List<Candidate__C> getCandidates(List<String> skills,String posCode){   //[java,php,react]

        // List<string> skills = new List<string>{'Apex','PD1'};

        // get candidate code from application where status Like : '%rejected%'
        List<String> candData=new List<String>();
        for(Application__c canD:[Select Candidate_Code__r.Name from Application__c where (not Status__c like '%rejected%') and Position_Code__c=:posCode]){
            candData.add(canD.Candidate_Code__r.Name);
        }

        // Set<String> accountNameMatches = new Set<String> {};  // [ %java% , %php% , %react% ]

            // for(String match:skills){
            //     accountNameMatches.add('%'+match+'%');  
            // }
            
        List<Candidate__C> accList = [SELECT Name,First_Name__c,Last_Name__c,Email__c,Phone_Number__c,Total_Experiene__c,Skill_Set__c from Candidate__c where Skill_Set__c Like:skills and Name Not In:candData];
        return accList;
        // 8 cand - 4 candidate
        // String SkillName='%'+skills+'%';
       // return [SELECT Name,First_Name__c,Last_Name__c,Total_Experiene__c,Skill_Set__c from Candidate__c where Skill_Set__c Like:(SkillName)];
    }


    @AuraEnabled
    public static string createApplication(String posCode, String candCode,List<String> skillIds){ 
        
        try {
            Application__c appln = new Application__c(
                Position_Code__c = posCode,
                Candidate_Code__c = candCode
                 );
            insert(appln);
            String applicationID = appln.ID;

            if(applicationID!=''){
                Candidate_Feedback__c candF = new Candidate_Feedback__c(
                    Application_Number__c =applicationID,
                    Position__C=posCode,
                    Candidate_Code__c = candCode
                    // Interview_Date__c= Date.parse(intDate)
                );
                insert(candF);

                List<Candidate_Skill_Feedback__c> CSF= new List<Candidate_Skill_Feedback__c>();
                
                for(String skill:skillIds){
                    CSF.add(
                        new Candidate_Skill_Feedback__c(
                            Candidate_Code__c=candCode,
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
                insert(CSF);
            }

            return 'Application Submitted Successfully';
            
        } catch (Exception e) {
            system.debug(e);
            return 'Insert Failed '+e;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Candidate_Skill_Feedback__c> getPositionSkillFeedback(String candidateCode,String positionCode){

        // system.debug(Cand_Feedback_id);
        try {

            return [Select Skill_Name__r.Name,Skill_Rating__c,Comments__c from Candidate_Skill_Feedback__c where Candidate_Code__c=:candidateCode and Position__c=:positionCode];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static string updatePositionSkillFeedback(Object data) {
    List<Candidate_Skill_Feedback__c> contactsForUpdate = (List<Candidate_Skill_Feedback__c>) JSON.deserialize(
         JSON.serialize(data),
         List<Candidate_Skill_Feedback__c>.class
    );
    try {
        update contactsForUpdate;
        return 'Success: contacts updated successfully';
    }
    catch (Exception e) {
        return 'The following exception has occurred: ' + e.getMessage();
    }
}
}