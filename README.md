Hi all,

I've deployed the whole infrastructure on AWS, the infrastructure is up and running and you can checkt it out by visiting http://phoenix.petereskandar.com/

![image](https://user-images.githubusercontent.com/24432011/112828859-91c18000-9090-11eb-88fb-d4c275ec0ed0.png)

I've used the following services to set up the current environment : 
    - Github: as a code repo
    - AWS ECR: as docker image repository
    - AWS Fargate: for docker containers deployment (Server & MongoDB)
    ![image](https://user-images.githubusercontent.com/24432011/112829187-0ac0d780-9091-11eb-9df2-4ab60596fa6d.png)
    
    - AWS Application Load Balancer & Target Group: for Container Orchestration
    ![image](https://user-images.githubusercontent.com/24432011/112829416-64c19d00-9091-11eb-86a4-d8cb2b8852a8.png)





