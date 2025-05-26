pipeline {
  agent any

  environment {
    REMOTE_HOST = "ubuntu@3.139.0.11"
    REMOTE_DIR = "/opt/chat-app"
    SSH_CREDENTIALS_ID = "chat-app-ec2-key"
  }

  stages {
    stage('Clone Repository') {
      steps {
        git url: 'https://github.com/JohnsonBV/Real-Time-Chat-App.git', branch: 'main'
      }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
          sh """
            ssh -o StrictHostKeyChecking=no $REMOTE_HOST '
              cd $REMOTE_DIR &&
              git pull &&
              npm install &&
              pm2 restart chat-app || pm2 start app.js --name chat-app
            '
          """
        }
      }
    }
  }
}

