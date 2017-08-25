$().ready(function(){
  console.log('ready');
  var data = {'hello': 3, 'world': 2}

  document.sensorData = data
  // $.ajax({
  //   url: '/api/get_all_sensors',
  // }).done(function(data){
  //     console.log('done')
  //     $('#sensorTableWrapper').append('    <px-data-table table-data="{"hello": 3, "world": 2}"></px-data-table>')
  // }).fail(function(err){
  //   console.log(err);
  // })



});
