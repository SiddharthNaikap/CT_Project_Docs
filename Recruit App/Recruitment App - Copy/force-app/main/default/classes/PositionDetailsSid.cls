public with sharing class PositionDetailsSid {
    @AuraEnabled(cacheable=true)
    public static List<Position__c> getOpenPositions(){

        return [SELECT Name,Minimum_Experience_Required__c,Position_Code__c FROM Position__c WHERE Status__c ='Active'];
    }

    @AuraEnabled(cacheable=true)
    public static List<Position_Skill__c> getSkills(String positionCode){
        return [SELECT Skill_Name__r.Name From Position_Skill__c WHERE Position_Code__r.id =:positionCode];
    }

    @AuraEnabled(cacheable=true)
    public static List<Candidate__C> getCandidates(List<String> skills){   //[java,php,react]

        // List<string> skills = new List<string>{'Apex','PD1'};

        Set<String> accountNameMatches = new Set<String> {};  // [ %java% , %php% , %react% ]

            for(String match:skills){
                accountNameMatches.add('%'+match+'%');  
            }
            
        List<Candidate__C> accList = [SELECT Name,First_Name__c,Last_Name__c,Email__c,Phone_Number__c,Total_Experiene__c,Skill_Set__c from Candidate__c where Skill_Set__c Like:accountNameMatches ];
        return accList;
        // String SkillName='%'+skills+'%';
       // return [SELECT Name,First_Name__c,Last_Name__c,Total_Experiene__c,Skill_Set__c from Candidate__c where Skill_Set__c Like:(SkillName)];
    }


    @AuraEnabled(cacheable=true)
    public static string createApplication(String posCode, String candCode){       
        Application__c application = new Application__c(
            Position_Code__c = posCode,
            Candidate_Code__c = candCode
             );
        insert application;
        ID applicationID = application.ID;
        return 'Successfully Inserted! - '+applicationID;
    }
}
