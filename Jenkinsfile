pipeline {
    agent any
    triggers {
        githubPush()
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'feat/42-jenkins-ci-cd',
                url: 'https://github.com/YourfriendRND/six-city-renovation-backend'
            }
        }
        
        stage('Deploy-to-server') {
            steps {
                script {
                    def dockerComposeFile = 'docker-compose.dev.yaml'
                    def envFile = '.env'
                    sshagent(['github-six-city-actions']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no jenkins@5.180.136.186 << 'REMOTE_SCRIPT'
                            cd /var/lib/jenkins/six-city-renovation-backend
                            git pull origin dev
                            docker compose -f ${dockerComposeFile} --env-file ${envFile} up -d
                            docker system prune -f
                            REMOTE_SCRIPT
                        """
                    }
                }
            }           
        }
    }
}
