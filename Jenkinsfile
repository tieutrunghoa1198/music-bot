pipeline {
  agent any

  environment {
    APP_NAME = 'music-bot'
    CONTAINER_NAME = 'music-bot' // Added this because you used it in "Build Docker Image"
    TOKEN = credentials('token_double_agent')
    CLIENT_ID = credentials('client_id')
    GUILD_ID = credentials('guild_id')
    MONGO_URI = credentials('mongo_uri')
  }

  stages {
    stage('Checkout') {
      steps {
        sshagent (credentials: ['jenkins-ci-music-bot']) {
          sh '''
            rm -rf repo
            git clone --branch prod git@github.com:tieutrunghoa1198/music-bot.git repo
            cp -r repo/. .
            rm -rf repo
          '''
        }
      }
    }

    stage('Build Docker Image If Needed') {
      steps {
        script {
          def imageExists = sh(
            script: "docker image inspect ${CONTAINER_NAME}:latest > /dev/null 2>&1",
            returnStatus: true
          ) == 0

          if (imageExists) {
            echo "✅ Docker image exists. Skipping build."
          } else {
            echo "📦 Image not found. Building..."
            sh "docker build -t ${CONTAINER_NAME}:latest ."
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
            -e TOKEN='${TOKEN}' \
            -e CLIENT_ID='${CLIENT_ID}' \
            -e GUILD_ID='${GUILD_ID}' \
            -e NODE_ENV=production \
            -e URI='${MONGO_URI}' \
            ${CONTAINER_NAME}:latest
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
