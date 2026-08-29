select
  storage.foldername('66444286-a0a2-4bcd-8163-7fe0cac87ad4/manual-test/1.png') as partes,
  (storage.foldername('66444286-a0a2-4bcd-8163-7fe0cac87ad4/manual-test/1.png'))[1] as primera_parte,
  (storage.foldername('66444286-a0a2-4bcd-8163-7fe0cac87ad4/manual-test/1.png'))[1] = '66444286-a0a2-4bcd-8163-7fe0cac87ad4'::text as deberia_ser_true;
