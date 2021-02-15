// Custom js codes goes here

(()=>{

    function Start()
    {
        console.log("App started...");

        let deleteButtons = document.querySelectorAll('.btn-danger');
        for(element of deleteButtons)
        {
            element.addEventListener("click",(event)=> {
            
                if(!confirm('Are you sure to delete?'))
                {    event.preventDefault();
                    window.location.assign('/books');
                }
            })
        }
        
        
    }

    window.addEventListener("load",Start);


})();