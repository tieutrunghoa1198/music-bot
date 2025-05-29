pipeline {
  agent any

  environment {
    APP_NAME = 'music-bot'
    TOKEN = credentials('token_double_agent')
    CLIENT_ID = credentials('client_id')
    GUILD_ID = credentials('guild_id')
    MONGO_URI = credentials('mongo_uri')
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'prod', url: 'git@github.com:tieutrunghoa1198/music-bot.git', credentialsId: 'jenkins-ci-music-bot'
      }
    }

    stage('Check Docker Image Exists') {
      steps {
        script {
          def exists = sh(
            script: "docker image inspect ${APP_NAME}:latest > /dev/null 2>&1",
            returnStatus: true
          ) == 0

          if (!exists) {
            error "❌ Docker image ${APP_NAME}:latest does not exist. Build it first."
          } else {
            echo "✅ Docker image ${APP_NAME}:latest found, proceeding to deploy."
          }
        }
      }
    }

    stage('Stop & Remove Previous Container') {
      steps {
        sh """
          docker stop ${APP_NAME} || true
          docker rm ${APP_NAME} || true
        """
      }
    }

    stage('Run New Container') {
      steps {
        sh """
          docker run -d --name ${APP_NAME} \
            -e TOKEN=${TOKEN} \
            -e CLIENT_ID=${CLIENT_ID} \
            -e GUILD_ID=${GUILD_ID} \
            -e NODE_ENV=production \
            -e URI=${MONGO_URI} \
            ${APP_NAME}:latest
        """
      }
    }
  }

  post {
    success {
      echo '✅ Deployed successfully!'
    }
    failure {
      echo '❌ Deployment failed.'
    }
  }
}
