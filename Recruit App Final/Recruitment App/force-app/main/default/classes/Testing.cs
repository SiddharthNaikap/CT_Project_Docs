Testing
###########
@isTest
public with sharing class PositionDetailsTest {
    
    @testSetUp static void createTestData(){a
        //Position
        Position__c pos = new Position__c(
            Name ='Test Position',
            Minimum_Experience_Required__c=3,
            Position_Description__c='Test poistion!', 
            Location__c='Mumbai',
            Status__c='Active'
        );
        insert pos;
        
        //Candidate
        Candidate__c  candidate = new Candidate__c(
            First_Name__c = 'Test', 
            Last_Name__c = 'Candidate 1',
            Email__c = 'testcan1@example.com',
            Skill_Set__c = 'JAVA',
            Phone_Number__c = '+91 0000000000'
        );
        insert candidate;
        
        //Application
        Application__c application = new Application__c(
            Position_Code__c = pos.Id,
            Application_Date__c = Date.today().addDays(-10),
            Status__c = 'New'
        );
        insert application;
        
        //CandidateFeedback
        Candidate_Feedback__c cFeedback = new Candidate_Feedback__c(
            Candidate_Code__c = candidate.Id,
            Position__c = pos.Id,
            Application_Number__c = application.Id,
            Interview_Level__c = 'L1',
            Interview_Date__c = Date.today()         
        );
        insert cFeedback;
        
        //Skill
        Skill__c skills = new Skill__c(
            Name = 'JAVA',
            Skill_Description__c ='Back-end Skill',
            Skill_Category__c = 'Developer'
        );
        insert skills;
        
        //Position-Skill
        Position_Skill__C posSkill = new Position_Skill__c(
            Position_Code__c =pos.Id,
            Skill_Name__c =skills.Id,
            Years__c =4
        );
        insert posSkill;
        
        //Candidate Skill Feedback
        Candidate_Skill_Feedback__c canskillFeddbk = new Candidate_Skill_Feedback__c(
            Candidate_Code__c = candidate.Id,
            Candidate_Feedback_Code__c = cFeedback.Id,
            Position__c = pos.Id,
            Skill_Name__c = skills.Id,
            Skill_Rating__c='4'
        );
        insert canskillFeddbk;
    }
    
    @isTest static void interviewToday(){
        List<Candidate_Feedback__c> intToday= PositionDetails.interviewsToday();
        System.debug('intToday:::'+intToday);
        System.assertEquals(1, intToday.size());
        System.assertEquals('L1',intToday[0].Interview_Level__c);
    }
    @isTest static void getOpenPositions(){
        List<Position__C> newPosition = PositionDetails.getOpenPositions();
        System.assertEquals(1, newPosition.size());
        System.assertEquals('Active', newPosition[0].Status__c);  
    }
    
    @isTest static void getSkills(){
        Position__c posId=[Select Id from Position__c limit 1];
        System.debug('posId '+posId.Id);
        List<Position_Skill__c> skills = PositionDetails.getSkills(posId.Id);
        System.assertNotEquals(null, skills.size(),'Skillset cant be empty');
        
    }
    
    @isTest static void getCandidates(){
        
        Position__c posId=[Select Id from Position__c limit 1];
        List<Position_Skill__C> skills = [Select Skill_Name__r.Name from Position_Skill__C where Position_Code__c=:posId.Id];
        List<Candidate__C> candidates= PositionDetails.getCandidates(new List<String>{skills[0].Skill_Name__r.Name},posId.Id);
        System.assertEquals(1, candidates.size());
    }
    
    @isTest static void createApplication(){
        Position__c posId=[Select Id from Position__c limit 1];
        List<Position_Skill__C> skills = [Select Skill_Name__r.Name,Skill_Name__c from Position_Skill__C where Position_Code__c=:posId.Id]; 
        Candidate__c candId =[Select Id from Candidate__c where Skill_Set__c Like:'%'+skills[0].Skill_Name__r.Name+'%'];
        
        String result=PositionDetails.createApplication(posId.Id,candId.Id,new List<String>{skills[0].Skill_Name__c});
        System.assertEquals('Application Submitted Successfully',result);
        
        String wrongdata=PositionDetails.createApplication('','',new List<String>{skills[0].Skill_Name__c});
        System.assertNotEquals('Application Submitted Successfully',wrongdata);
        
    }
    
    @isTest static void getPositionSkillFeedback(){
        Candidate_Feedback__c candFeed=[Select Id,Candidate_Code__c,Position__c from Candidate_Feedback__c limit 1];
        System.debug('Candidate feedback : '+candFeed);
        
        List<Candidate_Skill_Feedback__c> candidateFeedback = PositionDetails.getPositionSkillFeedback(candFeed.Candidate_Code__c,candFeed.Position__c,candFeed.Id);
        System.assertEquals('JAVA',candidateFeedback[0].Skill_Name__r.Name);
        
        // String wrongdata=PositionDetails.createApplication('','',new List<String>{skills[0].Skill_Name__c});
        // System.assertNotEquals('Application Submitted Successfully',wrongdata);
    }
    
    @isTest static void updatePositionSkillFeedback(){
        Candidate_Feedback__c candFeed=[Select Candidate_Code__c,Position__c from Candidate_Feedback__c limit 1];
        String Skillc =candFeed.Candidate_Code__c;
        String Id =candFeed.Position__c;
        List<Object> myObject = new List<Object>{Skillc,Id};
            String updates = PositionDetails.updatePositionSkillFeedback(myObject);
        System.assertNotEquals('Success: contacts updated successfully', updates);
    }
    
    @isTest static void getAdditionalSkillFeedback(){
        Candidate_Feedback__c candFeed=[Select Id,Candidate_Code__c,Position__c from Candidate_Feedback__c limit 1];
        System.debug('Candidate feedback : '+candFeed);
        List<Candidate_Skill_Feedback__c> SKillData= new List<Candidate_Skill_Feedback__c>{};
        
        List<Candidate_Skill_Feedback__c> candidateFeedback = CandidateSkillFeedback.getAdditionalSkillFeedback(candFeed.Candidate_Code__c,candFeed.Position__c,candFeed.Id);
        System.debug('getAdditionalSkillFeedback : '+candidateFeedback);
        System.assertEquals(SKillData,candidateFeedback);
        
        List<Candidate_Skill_Feedback__c> wrongData = CandidateSkillFeedback.getAdditionalSkillFeedback('',candFeed.Position__c,'');      
        
    }
    
    @isTest static void createAdditionalSkillFeedback(){
        Candidate_Feedback__c candFeed=[Select Id,Candidate_Code__c,Position__c from Candidate_Feedback__c limit 1];
        String result = CandidateSkillFeedback.createAdditionalSkillFeedback(candFeed.Id,candFeed.Candidate_Code__c,candFeed.Position__c,'MBA','3','');
    	System.assertEquals('Success',result);
        
        String exceptionResult = CandidateSkillFeedback.createAdditionalSkillFeedback('',candFeed.Candidate_Code__c,candFeed.Position__c,'MBA','3','');
    	System.assertNotEquals('Success',exceptionResult);
    }
    
    @isTest static void updateAdditionalSkillFeedback(){
        Candidate_Feedback__c candFeed=[Select Candidate_Code__c,Position__c from Candidate_Feedback__c limit 1];
        String Skillc =candFeed.Candidate_Code__c;
        String Id =candFeed.Position__c;
        List<Object> myObject = new List<Object>{Skillc,Id};
        String updates = CandidateSkillFeedback.updateAdditionalSkillFeedback(myObject);
        System.assertNotEquals('Success: contacts updated successfully', updates);
    }
}