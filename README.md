Hi all,

I've deployed the whole infrastructure on AWS, the infrastructure is up and running and you can checkt it out by visiting **http://phoenix.petereskandar.com/**

![image](https://user-images.githubusercontent.com/24432011/112828859-91c18000-9090-11eb-88fb-d4c275ec0ed0.png)

I've used the following services to set up the current environment : 
    1. **Github:** as a code repo
    2. **AWS ECR:** as docker image repository
    3. **AWS Fargate:** for docker containers deployment (Server & MongoDB)
    4. **AWS Application Load Balancer & Target Group:** for Container Orchestration
    5. **ECS Fargate Service Autoscaling:** for containers autoscaling
    6. **CloudWatch:** 
       - for containers logs 
       - containers autoscaling triggering
    8.  **AWS Route53:** 
       - for DNS Management (http://phoenix.petereskandar.com/)
       - for AWS Fargate Services Communication using a private hosted zone (phoenix-mongo-db-service.local)
    9. **AWS CodePipeLine & AWS CodeBuild:** for CI/CD
    10. **AWS CloudFormation:** I wanted to prepare a Cloudformation template but I ran out of time

---

**AWS Fargate :**  
* I've created two dockerfiles, one for the **Node server** and the other one was for **MongoDB**, after building both of them, they were pushed to **ECR** as shown below
![image](https://user-images.githubusercontent.com/24432011/112832203-43fb4680-9095-11eb-9f08-303feea24f9e.png)
* Then I've created two task definitions one for each container using the images already pushed to ECR, Created an **ECS Fargate Cluster** and then a Service for each task Definition
![image](https://user-images.githubusercontent.com/24432011/112829187-0ac0d780-9091-11eb-9df2-4ab60596fa6d.png)
* For the node server Fargate Service (**phoenixKataService**), I've created an **Application load balancer** which will orchestrate the service tasks (in case of multiple tasks) 
and will manage tasks health checks in case of failure a new task will be created (for example when calling the **/crash** api)
![image](https://user-images.githubusercontent.com/24432011/112829837-fb8e5980-9091-11eb-855c-adee03bf1f3e.png)
* For Backup logs and Database, my idea is to create a shared file system (for example: **EFS**) where both containers can mount to, 
and then a weekly backup could be done for this shred file system
![image](https://user-images.githubusercontent.com/24432011/112833738-70b05d80-9097-11eb-9aca-ea35cfc3809a.png)
* For Autoscaling; I've created the following role to scale the node server (adding more **Fargate Tasks**) in case of increated traffic
![image](https://user-images.githubusercontent.com/24432011/112834233-08ae4700-9098-11eb-9255-5c008e39c25b.png)
* Regarding Containers communication, as mentioned above, I've created a private hosed zone with **AWS Route53**, 
and by using **Service discovery integration** in **ECS Fargate** service a record has been created for the Service running **MongoDB** tasks (phoenix-mongo-db-service.local)

![image](https://user-images.githubusercontent.com/24432011/112839409-78bfcb80-909e-11eb-957f-384464dd7bf4.png)
* to be able to pass the **DB_CONNECTION_STRING** as an environment variables to all **Node server** tasks, i do it as following :
![image](https://user-images.githubusercontent.com/24432011/112840136-42368080-909f-11eb-96b2-db8c0cc2a08a.png)

---

**CI/CD Implementation :**
* The CI/CD pipeline is up and running, to test it just modify the code and push it to **master** branch, all changes will be reflected on **http://phoenix.petereskandar.com/**
* As mentioned above, I've used AWS Codepipline with AWS CodeBuild and Github repo for implementing the pipline.
* The CI/CD pipeline works in the following way : 
    - On Code change on **master** branch, **AWS Codepipline** will trigger **CodeBuild** to do the following tasks using the **buildspec.yml** file : 
        - on **pre_build** : 
            - Login to **ECR** repo
              ```
               pre_build:
                   commands:
                     - printenv
                     - echo Logging in to Amazon ECR...
                     - aws ecr get-login-password --region $AWS_DEFAU
               ```
               
       - on **build** :
            - Docker Image Build
            - Docker Imange tag
                 ```
                 build:
                    commands:
                      - echo Build started on `date`
                      - echo Building the Docker image...
                      - echo $AWS_DEFAULT_REGION:$IMAGE_TAG
                      - docker build -t $IMAGE_REPO_NAME .
                      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
                 ```
      - on **post_build** :
           - Push update Docker Image to **ECR**
           - Update the **ECS Cluster Service** (the one running the node server) with force-new-deployment to get the latest pushed image from ECR

                  post_build:
                    commands:
                      - echo Build completed on `date`
                      - echo Pushing the Docker image...
                      - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
                      - aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment
                      - echo success force update-service
       
---            
