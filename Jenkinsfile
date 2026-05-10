pipeline {

    agent any

    parameters {
        string(
            name: 'IMAGE_TAG',
            defaultValue: 'latest',
            description: 'Docker image tag from GitHub Actions'
        )
    }

    environment {
        AKS_RESOURCE_GROUP = 'aks-kubernetes-grp'
        AKS_CLUSTER_NAME  = 'aks-demo-cluster'
        NAMESPACE         = 'cloudgallery'
    }

    stages{

        stage('Checkout Code') {
            steps {

                git branch: 'main',
                url: 'https://github.com/harcastic/AKS-Deployment-Pipeline.git'
            }
        }

        stage('Azure Login') {
            steps {

                withCredentials([
                    string(credentialsId: 'AZURE_CLIENT_ID', variable: 'CLIENT_ID'),
                    string(credentialsId: 'AZURE_CLIENT_SECRET', variable: 'CLIENT_SECRET'),
                    string(credentialsId: 'AZURE_TENANT_ID', variable: 'TENANT_ID')
                ]) {

                    sh ' az login --service-principal -u $CLIENT_ID -p $CLIENT_SECRET --tenant $TENANT_ID '
                }
            }
        }

        stage('Connect to AKS') {
            steps {

                sh ' az aks get-credentials --resource-group $AKS_RESOURCE_GROUP --name $AKS_CLUSTER_NAME --overwrite-existing'
            }
        }

        stage('Create Kubernetes Secrets') {
            steps {

                withCredentials([
                    string(credentialsId: 'MONGODB_URI', variable: 'MONGODB_URI'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                    string(credentialsId: 'JWT_REFRESH_SECRET', variable: 'JWT_REFRESH_SECRET'),
                    string(credentialsId: 'AZURE_STORAGE_CONNECTION_STRING', variable: 'AZURE_STORAGE_CONNECTION_STRING')
                ]) {

                   sh ' kubectl create secret generic cloudgallery-secret --from-literal=MONGODB_URI="$MONGODB_URI" --from-literal=JWT_SECRET="$JWT_SECRET" --from-literal=JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" --from-literal=AZURE_STORAGE_CONNECTION_STRING="$AZURE_STORAGE_CONNECTION_STRING" --namespace=$NAMESPACE --dry-run=client -o yaml | kubectl apply -f - '
                }
            }
        }

        stage('Apply Kubernetes Manifests') {
            steps {

                sh ' kubectl apply -f k8s/ '
            }
        }

        stage('Deploy Frontend') {
            steps {

                sh ' kubectl set image deployment/cloudgalleryfrontend frontend-cont=harcastic/cloudgalleryfrontend:${IMAGE_TAG} -n $NAMESPACE '
            }
        }

        stage('Deploy Backend') {
            steps {

                sh ' kubectl set image deployment/cloudgallerybackend backend-cont=harcastic/cloudgallerybackend:${IMAGE_TAG} -n $NAMESPACE '
            }
        }

        stage('Verify Frontend Rollout') {
            steps {

                sh 'kubectl rollout status deployment/cloudgalleryfrontend -n $NAMESPACE '
            }
        }

        stage('Verify Backend Rollout') {
            steps {

                sh ' kubectl rollout status deployment/cloudgallerybackend -n $NAMESPACE '
            }
        }

        stage('Get Services') {
            steps {

                sh 'kubectl get svc -n $NAMESPACE '
            }
        }

        stage('Get Pods') {
            steps {

                sh ' kubectl get pods -n $NAMESPACE '
            }
        }
    }
    
    post {

        success {
            echo "Cloud Gallery successfully deployed to AKS"
        }

        failure {
            echo "Deployment failed. Check Jenkins logs immediately."
        }
    }
}