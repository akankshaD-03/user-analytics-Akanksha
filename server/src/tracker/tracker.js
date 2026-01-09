(function () {
    const API = 'http://localhost:4000/api/events';
    const KEY = 'ua_session_id';
  
    function getSessionId() {
      let id = localStorage.getItem(KEY);
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(KEY, id);
      }
      return id;
    }
  
    const sessionId = getSessionId();
  
    function send(payload) {
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  
    send({
      session_id: sessionId,
      event_type: 'page_view',
      page_url: location.pathname,
      timestamp: Date.now(),
    });
  
    document.addEventListener('click', (e) => {
      send({
        session_id: sessionId,
        event_type: 'click',
        page_url: location.pathname,
        timestamp: Date.now(),
        x: e.clientX,
        y: e.clientY,
      });
    });
  })();
  