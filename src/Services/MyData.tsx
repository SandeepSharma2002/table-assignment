class userData{
  
    getUsers() {
      return fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json ')
      .then(res => res.json())
    }
    
  }
  
  export default new userData();
  