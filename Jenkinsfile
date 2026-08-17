// Aequivalent zur GitHub-Actions-Pipeline (.github/workflows/ci.yml), als Jenkins
// Declarative Pipeline - die Ausschreibung nennt beide Tools, hier siehst du den
// gleichen Ablauf in beiden Systemen. Siehe Kapitel "Jenkins" im Interview-Guide.
pipeline {
  agent any

  stages {
    stage('Backend: Install & Test') {
      agent { docker { image 'node:20'}}
      steps {
        dir('backend') {
          sh 'npm install'
          sh 'npm run test -- --coverage'
          sh 'npm run build'
        }
      }
    }

    stage('Frontend: Install & Build') {
      steps {
        dir('frontend') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

    stage('E2E: Cypress') {
      steps {
        dir('frontend') {
          sh 'npx start-server-and-test start http://localhost:4200 e2e:ci'
        }
      }
    }

    stage('Approval') {
      // Entspricht "achieve approval" aus der Ausschreibung: die Pipeline pausiert,
      // bis jemand manuell bestaetigt.
      steps {
        input message: 'Freigabe fuer Produktion erteilen?'
      }
    }

    stage('Deploy') {
      when { branch 'main' }
      steps {
        echo 'Deploy nach Produktion (z. B. cf push auf SAP BTP Cloud Foundry).'
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'backend/coverage/**/*.xml'
    }
  }
}
