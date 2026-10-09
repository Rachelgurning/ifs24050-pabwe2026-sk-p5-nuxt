pipeline {
  agent any
  options {
    timestamps()
    ansiColor('xterm')
    timeout(time: 45, unit: 'MINUTES')
    disableConcurrentBuilds()
  }
  environment {
    SONAR_PROJECT_KEY = 'ifs24050-pabwe2026-sk-p5-nuxt'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install and Verify') {
      agent {
        docker {
          image 'oven/bun:1.2.22'
          reuseNode true
          args '-u root'
        }
      }
      steps {
        sh '''
          set -eu
          bun --version
          bun install
          bun run typecheck
          bun run test:run
          bun run test:coverage
          bun run build
        '''
      }
    }
    stage('SonarQube Analysis') {
      agent {
        docker {
          image 'sonarsource/sonar-scanner-cli:latest'
          reuseNode true
          args '-u root'
        }
      }
      steps {
        withSonarQubeEnv('SonarQube') {
          sh '''
            set -eu
            sonar-scanner \\
              -Dsonar.projectKey="$SONAR_PROJECT_KEY" \\
              -Dsonar.host.url="$SONAR_HOST_URL" \\
              -Dsonar.token="$SONAR_AUTH_TOKEN"
          '''
        }
      }
    }
    stage('Quality Gate') {
      steps {
        timeout(time: 10, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }
  post {
    always {
      echo 'Pipeline selesai. Periksa hasil Test, Coverage, dan SonarQube pada stage di atas.'
    }
  }
}
