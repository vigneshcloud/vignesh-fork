pipeline {
    agent any
    stages {
        stage('Tests') {
            steps {
//                 script {
//                    docker.image('node:10-stretch').inside { c ->
                        echo 'Building..'
                        sh 'npm install'
                        echo 'Testing..'
                        sh 'npm test'
//                         sh "docker logs ${c.id}"
//                    }
//                 }
            }
        }
        stage('Build and push docker image') {
            steps {
                script {
                    def dockerImage = docker.build("vigneshcloud/vignesh-fork:master")
                    docker.withRegistry('', 'docker_hub') {
                        dockerImage.push('master')
                    }
                }
            }
        }
       stage('DeployToProduction') {
            when {
                branch 'master'
            }
            steps {
                input 'Deploy to Production?'
                milestone(1)
                withCredentials([usernamePassword(credentialsId: 'prod_server', usernameVariable: 'USERNAME', passwordVariable: 'USERPASS')]) {
                    script {
                        sh "sshpass -p 'VMwar3!!' -v ssh -o StrictHostKeyChecking=no cloud_user@34.240.129.10 \"docker pull vigneshcloud/vignesh-fork:${env.BUILD_NUMBER}\""
                        try {
                            sh "sshpass -p 'VMwar3!!' -v ssh -o StrictHostKeyChecking=no cloud_user@34.240.129.10 \"docker stop vignesh-fork\""
                            sh "sshpass -p 'VMwar3!!' -v ssh -o StrictHostKeyChecking=no cloud_user@34.240.129.10 \"docker rm vignesh-fork\""
                        } catch (err) {
                            echo: 'caught error: $err'
                        }
                        sh "sshpass -p 'VMwar3!!' -v ssh -o StrictHostKeyChecking=no cloud_user@34.240.129.10 \"docker run --restart always --name vignesh-fork -p 8080:8080 -d vigneshcloud/vignesh-fork:${env.BUILD_NUMBER}\""
                    }
                }
            }
        }
    }
}
