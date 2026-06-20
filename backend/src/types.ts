export class MetaDto {
  page: number;
  rpp: number;
  totalPages: number;
  totalItems: number;
}

export class ApiResponseDto<T> {
  data: T;
  message: string;
  meta?: MetaDto;
}
