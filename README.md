# Helm Subcharts Steps
The Docker image must be built before starting
```bash
helm create mysubchart
helm create mychart
```
- Modify values.yml of mysubchart
    - Set the Docker image called dependent
    - Set the values of the environment variables

- Modify values.yml of mychart
    - Set the Docker image called dependent
    - Set the values of the environment variables
    - Set the values of the environment variables of mysubchart, this overwrites the ones it has
    - Set the port of the mychart service and the mysubchart service in the mychart Chart
    - Set ingress for mychart and mysubchart in the mychart Chart

- Modify templates/deployment.yml of mychart
    - readinessProbe must have port 3000, and initial delay 5 sec

- Add the reference to the dependency repo to mychart, Chart.yml:
    - dependencies.repository: "file://../mysubchart"

- Update the charts that mychart depends on:
```bash
cd mychart
helm dependency update
```
- Then it can be deployed
```bash
helm install my-release .
```
- And check
```bash
kubectl get deployments
kubectl get pods
kubectl logs <pod-name>
kubectl get svc
kubectl get ingress
```
- Make requests to the APIs
```bash
kubectl port-forward svc/my-release-mychart 3000:3000
kubectl port-forward svc/my-release-mysubchart 3000:3000
```