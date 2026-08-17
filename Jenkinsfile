// Aequivalent zur GitHub-Actions-Pipeline (.github/workflows/ci.yml), als Jenkins
// Declarative Pipeline - die Ausschreibung nennt beide Tools, hier siehst du den
// gleichen Ablauf in beiden Systemen. Siehe Kapitel "Jenkins" im Interview-Guide.

def notifyGitHub(String state, String description) {
  withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
    sh """
      curl -s -X POST \
        -H "Authorization: token \$GITHUB_TOKEN" \
        -H "Content-Type: application/json" \
        https://api.github.com/repos/${env.GITHUB_REPO}/statuses/${env.GIT_SHA} \
        -d '{"state":"${state}","context":"jenkins/pipeline","description":"${description}","target_url":"${env.BUILD_URL}"}'
    """
  }
}

pipeline {
  agent none

  stages {
    stage('Report: Pending') {
      agent any
      steps {
        script {
          env.GITHUB_REPO = 'PAtB1992/pokemon-compliance'
          env.GIT_SHA = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
          notifyGitHub('pending', 'Jenkins-Pipeline laeuft...')
        }
      }
    }

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
      // Entspricht "achieve approval" aus der Ausschreibung: die Pipeline pausiert,
      // bis jemand manuell bestaetigt.
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

  post {
    success {
      node {
        script { notifyGitHub('success', 'Alle Stages erfolgreich') }
      }
    }
    failure {
      node {
        script { notifyGitHub('failure', 'Pipeline fehlgeschlagen') }
      }
    }
  }
}
