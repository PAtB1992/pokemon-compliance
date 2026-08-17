pipeline {
  agent none

  stages {
stage('Backend: Install & Test') {
  agent {
    docker { image 'node:20' }
  }
  environment {
    HOME = "${WORKSPACE}"
  }
  steps {
    dir('backend') {
      sh 'npm ci'
      sh 'npm run test -- --coverage'
      sh 'npm run build'
    }
  }
  post {
    always {
      junit allowEmptyResults: true, testResults: 'backend/coverage/**/*.xml'
    }
  }
}

    stage('Frontend: Install & Build') {
      agent {
        docker { image 'node:20' }
      }
      environment {
        HOME = "${WORKSPACE}"
      }
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('E2E: Cypress') {
      agent {
        docker {
          image 'cypress/browsers:node-20.16.0-chrome-127.0.6533.88-1-ff-128.0.3-edge-127.0.2651.74-1'
          args '--ipc=host'
        }
      }
      environment {
        HOME = "${WORKSPACE}"
      }
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npx start-server-and-test start http://localhost:4200 e2e:ci'
        }
      }
    }

    stage('Approval') {
      agent any
      steps {
        input message: 'Freigabe fuer Produktion erteilen?'
      }
    }

    stage('Deploy') {
      agent any
      when { branch 'main' }
      steps {
        echo 'Deploy nach Produktion (z. B. cf push auf SAP BTP Cloud Foundry).'
      }
    }
  }
}
