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
        sh '''
          eval `ssh-agent -s`
          ssh-add ~/.ssh/id_rsa
          git clone --branch prod git@github.com:tieutrunghoa1198/music-bot.git repo
          cp -r repo/* .
        '''
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${CONTAINER_NAME}:latest ."
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
