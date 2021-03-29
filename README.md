Hi all,

I've deployed the whole infrastructure on AWS, the infrastructure is up and running and you can checkt it out by visiting http://phoenix.petereskandar.com/

![image](https://user-images.githubusercontent.com/24432011/112828859-91c18000-9090-11eb-88fb-d4c275ec0ed0.png)

I've used the following services to set up the current environment : 

    1. **Github**: as a code repo
    2. AWS ECR: as docker image repository
    3. AWS Fargate: for docker containers deployment (Server & MongoDB)
    4. AWS Application Load Balancer & Target Group: for Container Orchestration
    5. ECS Fargate Service Autoscaling: for containers autoscaling
    6. CloudWatch: 
       - for containers logs 
       - containers autoscaling triggering
    8.  AWS Route53: 
       - for DNS Management (http://phoenix.petereskandar.com/)
       - for AWS Fargate Services Communication using a private hosted zone (phoenix-mongo-db-service.local)
    9. AWS CodePipeLine & AWS CodeBuild: for CI/CD


![image](https://user-images.githubusercontent.com/24432011/112829187-0ac0d780-9091-11eb-9df2-4ab60596fa6d.png)
![image](https://user-images.githubusercontent.com/24432011/112829837-fb8e5980-9091-11eb-855c-adee03bf1f3e.png)
