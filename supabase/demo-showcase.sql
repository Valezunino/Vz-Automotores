-- Repeatable presentation data. No real customers, phone numbers or sales.
begin;
insert into public.vehicles (brand,model,year,kilometers,fuel,transmission,category,price,status,color,engine,equipment,images,featured,published,description)
select v.*, 'DEMO VZ SEPTIEMBRE: modelo real, fotografía de referencia. Precio, kilometraje y disponibilidad ficticios para mostrar el funcionamiento del sitio. No representa una unidad ofrecida en venta.'
from (values
 ('Toyota','Corolla XEi CVT',2017,86000,'Nafta','Automático','Sedán',21500000::bigint,'Disponible','Gris plata','1.8 Dual VVT-i · CVT','["Climatizador","Control de estabilidad","Frenos ABS","Airbags"]'::jsonb,'["assets/toyota-corolla-xei.webp"]'::jsonb,true,true),
 ('Volkswagen','Taos Comfortline 250 TSI',2022,41500,'Nafta','Automático','SUV',42900000::bigint,'Reservado','Negro','1.4 TSI · 150 CV · Tiptronic 6','["VW Play","Control de estabilidad","Cámara de retroceso","Airbags"]'::jsonb,'["assets/volkswagen-taos.webp"]'::jsonb,true,true),
 ('Chevrolet','Tracker Premier 1.2 Turbo',2024,12800,'Nafta','Automático','SUV',39700000::bigint,'Disponible','Rojo','1.2 Turbo · Automática 6','["Chevrolet MyLink","Control de estabilidad","Cámara de retroceso","Airbags"]'::jsonb,'["assets/chevrolet-tracker.webp"]'::jsonb,true,true),
 ('Volkswagen','Golf Highline 1.4 TSI DSG',2018,72000,'Nafta','Automático','Hatchback',28600000::bigint,'Vendido','Blanco','1.4 TSI · 150 CV · DSG 7','["Climatizador","Control de estabilidad","Sensores de estacionamiento","Airbags"]'::jsonb,'["assets/volkswagen-golf.webp"]'::jsonb,false,true)
) as v(brand,model,year,kilometers,fuel,transmission,category,price,status,color,engine,equipment,images,featured,published)
where not exists(select 1 from public.vehicles x where x.brand=v.brand and x.model=v.model and x.description like 'DEMO VZ SEPTIEMBRE:%');

insert into public.leads(name,phone,email,message,vehicle_id,channel,status,assigned_to,created_at)
select x.name,'DEMO - sin teléfono',null,'DEMO VZ SEPTIEMBRE: '||x.message,v.id,'Formulario web',x.status,case when x.status='Nueva' then null else 'Demostración' end,now()-x.age*interval '1 hour'
from (values
 ('DEMO · Martín','Corolla XEi CVT','¿Puedo coordinar una visita para ver el Corolla?','Nueva',1),
 ('DEMO · Sofía','Taos Comfortline 250 TSI','Quiero conocer las condiciones de reserva.','Contactado',3),
 ('DEMO · Lucas','Tracker Premier 1.2 Turbo','¿Se puede entregar un usado como parte de pago?','Visita agendada',6),
 ('DEMO · Carolina','Golf Highline 1.4 TSI DSG','Me interesa recibir novedades de otro Golf similar.','Cerrada',24),
 ('DEMO · Diego','Corolla XEi CVT','Quisiera consultar opciones de financiación.','Contactado',30),
 ('DEMO · Lucía','Tracker Premier 1.2 Turbo','Quiero ver el equipamiento y coordinar una prueba.','Nueva',2),
 ('DEMO · Nicolás','Taos Comfortline 250 TSI','¿Pueden avisarme si vuelve a estar disponible?','Nueva',5),
 ('DEMO · Paula','Corolla XEi CVT','Visita coordinada para conocer el vehículo.','Visita agendada',48)
) as x(name,model,message,status,age)
join public.vehicles v on v.model=x.model and v.description like 'DEMO VZ SEPTIEMBRE:%'
where not exists(select 1 from public.leads l where l.name=x.name and l.message like 'DEMO VZ SEPTIEMBRE:%');

insert into public.trade_ins(name,phone,brand,model,year,kilometers,notes,status,estimated_value,created_at)
select x.name,'DEMO - sin teléfono',x.brand,x.model,x.year,x.km,'DEMO VZ SEPTIEMBRE: solicitud ficticia para mostrar la tasación. Sin datos de una persona real.',x.status,x.value,now()-x.age*interval '1 hour'
from (values
 ('DEMO · Marcos','Volkswagen','Gol Trend',2018,86000,'Pendiente',null::bigint,2),
 ('DEMO · Julia','Ford','EcoSport SE',2017,112500,'Evaluación',null::bigint,8),
 ('DEMO · Javier','Chevrolet','Onix LT',2020,61200,'Tasado',14000000::bigint,26),
 ('DEMO · Ana','Toyota','Etios XLS',2019,73000,'Aceptado',12500000::bigint,50)
) x(name,brand,model,year,km,status,value,age)
where not exists(select 1 from public.trade_ins t where t.name=x.name and t.notes like 'DEMO VZ SEPTIEMBRE:%');

insert into public.financing_requests(name,phone,vehicle_id,vehicle_value,deposit,installments,estimated_payment,status,created_at)
select x.name,'DEMO - sin teléfono',v.id,v.price,x.deposit,x.term,round((v.price-x.deposit)*(1+x.term*0.0125)/x.term),x.status,now()-x.age*interval '1 hour'
from (values
 ('DEMO · Lucas','Tracker Premier 1.2 Turbo',15000000::bigint,36,'Pendiente',1),
 ('DEMO · María','Corolla XEi CVT',8000000::bigint,24,'Evaluación',5),
 ('DEMO · Esteban','Taos Comfortline 250 TSI',18000000::bigint,36,'Aprobada',20),
 ('DEMO · Ana Belén','Golf Highline 1.4 TSI DSG',10000000::bigint,24,'Rechazada',45)
) x(name,model,deposit,term,status,age)
join public.vehicles v on v.model=x.model and v.description like 'DEMO VZ SEPTIEMBRE:%'
where not exists(select 1 from public.financing_requests f where f.name=x.name and f.phone='DEMO - sin teléfono');

insert into public.activity_events(event_type,vehicle_id,metadata,created_at)
select 'DEMO · Publicación cargada: '||v.brand||' '||v.model,v.id,'{"demo_batch":"vz-septiembre","simulated":true}'::jsonb,now()-interval '4 days'
from public.vehicles v where v.description like 'DEMO VZ SEPTIEMBRE:%' and not exists(select 1 from public.activity_events e where e.vehicle_id=v.id and e.metadata->>'demo_batch'='vz-septiembre');
insert into public.activity_events(event_type,vehicle_id,metadata,created_at)
select 'DEMO · Consulta '||lower(l.status)||': '||l.name,l.vehicle_id,jsonb_build_object('demo_batch','vz-septiembre','simulated',true,'lead_id',l.id),l.created_at
from public.leads l where l.message like 'DEMO VZ SEPTIEMBRE:%' and not exists(select 1 from public.activity_events e where e.metadata->>'lead_id'=l.id::text);
insert into public.activity_events(event_type,metadata,created_at)
select 'DEMO · Tasación '||lower(t.status)||': '||t.brand||' '||t.model,jsonb_build_object('demo_batch','vz-septiembre','simulated',true,'trade_id',t.id),t.created_at
from public.trade_ins t where t.notes like 'DEMO VZ SEPTIEMBRE:%' and not exists(select 1 from public.activity_events e where e.metadata->>'trade_id'=t.id::text);
insert into public.activity_events(event_type,vehicle_id,metadata,created_at)
select 'DEMO · Financiación '||lower(f.status)||': '||f.name,f.vehicle_id,jsonb_build_object('demo_batch','vz-septiembre','simulated',true,'finance_id',f.id),f.created_at
from public.financing_requests f where f.name like 'DEMO · %' and f.phone='DEMO - sin teléfono' and not exists(select 1 from public.activity_events e where e.metadata->>'finance_id'=f.id::text);
commit;
