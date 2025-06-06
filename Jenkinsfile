pipeline {
  agent any

  environment {
    APP_NAME = 'music-bot'
    CONTAINER_NAME = 'music-bot-image'
    TOKEN = credentials('token_double_agent')
    CLIENT_ID = credentials('client_id')
    GUILD_ID = credentials('guild_id')
    MONGO_URI = credentials('mongo_uri')
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'git@github.com:tieutrunghoa1198/music-bot.git', branch: 'prod', credentialsId: 'jenkins-ci-music-bot'
      }
    }

    stage('Install Dependencies & Build') {
      steps {
        sh 'npm ci'                      // install with devDependencies
        sh 'npm run build'               // build, output to ./dist
        sh '''
          find dist -name "*.js" -exec npx terser --compress --mangle -o {} -- {} \\;
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
            --restart unless-stopped \
            --memory=2g \
            -e TOKEN=${TOKEN} \
            -e CLIENT_ID=${CLIENT_ID} \
            -e GUILD_ID=${GUILD_ID} \
            -e NODE_ENV=production \
            -e MONGO_URI=${MONGO_URI} \
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
